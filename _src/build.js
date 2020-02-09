const fs = require('fs');
const path = require('path');
const glob = require('glob');
const yaml = require('js-yaml');
const mkdirp = require('mkdirp');
const ejs = require('ejs');
const chroma = require('chroma-js');


const md = require('markdown-it')({
    // markdown options
    html: true,
    linkify: true,
    typographer: true,
})
.use(require('markdown-it-anchor'))
.use(require('markdown-it-footnote'))
.use(require('markdown-it-meta'))
.use(require('markdown-it-sub'))
.use(require('markdown-it-center-text'))
.use(require('markdown-it-sup'))
.use(require('markdown-it-container'), 'dynamic', {
    validate: function() { return true; },
    render: function(tokens, idx) {
        var token = tokens[idx];

        if (token.nesting === 1) {
            return '<div class="' + token.info.trim() + '">';
        } else {
            return '</div>';
        }
    },
})
.use(require('markdown-it-table-of-contents'));

md.renderer.rules.footnote_caption = (tokens, idx) => {
    var n = Number(tokens[idx].meta.id + 1).toString();

    if (tokens[idx].meta.subId > 0) {
        n += ':' + tokens[idx].meta.subId;
    }

    return n;
};

let language = 'en';

md.renderer.rules.footnote_block_open = ( page) => (
  '<section class="footnotes">\n' +
  '<h2>'+({en:'References',de:'Quellenangaben'}[language])+'</h2>\n' +
  '<ol class="footnotes-list">\n'
);

const importMarkdownReg = /^@import "([^"]+\.md)"$/gm;
const importTemplateReg = /^<!-- @template "([^"]+)" +-->$/gm;

const data = {};
// import data files
glob.sync('_src/data/*.yaml').forEach(file => {
    data[path.basename(file, '.yaml')] = yaml.safeLoad(fs.readFileSync(file, 'utf-8'));
})

process.argv.slice(2).forEach(pattern => {
    glob.sync(pattern).forEach(async file => {
        // resolve markdown imports
        let markdown = fs.readFileSync(file, 'utf-8');

        while (importMarkdownReg.test(markdown)) {
            markdown = markdown.replace(importMarkdownReg, function(s) {
                const m = /@import "([^"]+\.md)"/.exec(s);
                if (m) {
                    const includeFile = path.join(path.dirname(file), m[1]);
                    return '\n'+fs.readFileSync(includeFile, 'utf-8')+'\n';
                }
            });
        }

        language = file.indexOf('/de/') > -1 || file.indexOf('.de.') > -1 ? 'de' : 'en';

        if (file.split('/').slice(1).find(p => p.charAt(0) === '_')) {
            // skip file because it starts with _
            return;
        }

        let body = md.render(markdown)
            .replace(/:im-[a-z\-]+:/g, (im) => `<i class="im ${im.substr(1, im.length-2)}"></i>`);

        const out = file.replace('_src/pages/', './docs/').replace('.md', '.html');
	    mkdirp.sync(path.dirname(out));

        const meta = {
            template: 'page',
            title: '',
            language: out.substr(9,2),
            file: path.basename(file, '.md'),
            ...md.meta
        };

        // resolve all embedded templates
        const promises = [];
        body = body.replace(importTemplateReg, function(s) {
            const m = /@template "([^"]+)"/.exec(s);
            promises.push(ejs.renderFile(`_src/templates/_partials/${m[1]}.ejs`, {
                page: meta,
                data
            }).then(str => {
                body = body.replace(s, str);
            }));
            return s;
        });

        await Promise.all(promises);

        // create redirects for this page
        if (meta.alias) {
            if (!Array.isArray(meta.alias)) meta.alias = [meta.alias];
            meta.alias.forEach(url => {
                ejs.renderFile(`_src/templates/redirect.ejs`,{
                    url: out.replace('./docs/', '/')
                })
                    .then(page => {
                        const redirect = url.replace('/', './docs/');
                        mkdirp.sync(path.dirname(redirect));
                        fs.writeFileSync(redirect+'.html', page);
                    });
            })
        }

        ejs.renderFile(`_src/templates/${meta.template}.ejs`, {
            page: meta,
            body,
            chroma,
            data
        }).then(page => {
            fs.writeFileSync(out, page);
            console.log('wrote', out);
        });

    });
});


