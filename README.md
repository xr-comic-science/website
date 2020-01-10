xr comic science website
========================

This document is here to document the current setup of our website hosted at xrscience.earth

## FAQ

### How and where is the website hosted?

The website is hosted from a Keybase git repository located at
keybase://team/xr_comicscience.website/website.

**New contributors**: make pull requests on Github.

**Established contributors**: The materbranch on keybase is in production.

To make changes, you will need to be a member of the xr_comicscience.website
keybase team.

To put changes into production, pull from Github `master` and make edits. Then push
keybase master changes. Please remember to also push changes to github.



team on keybase.

### How can I download the website to my computer?

Clone the website git repository. The first time you cloned the
repo you also need to run npm install:

    git clone keybase://team/xr_comicscience.website/website
    cd website
    npm install

### How can I preview website changes on my computer?

Edit the page templates (`_src/templates`) or markdown sources
(`_src/pages`). Then run make  folder to re-generate the websites
HTML pages. To preview the website locally, run `make preview` and
open the website at http://localhost:5000.

    make
    make preview

### How can I push my changes to the live website?

If you feel fine about your changes, commit the changes to the git
repo using `git add .` and `git commit`, and then push the commits
to Keybase using `git push`. That's it!

    make
    git add .
    git commit -m "some minor copy edits"
    git push


### How can I add resource files?

Resource files are stored in the
(keybase website folder)[keybase://team/xr_comicscience.website]. You'll need
write permission to change files.


### How can I hide files from the website even though they are in the repository?

You can use the `.kbp_config` file to make files inaccessible through
the website. This is what we've done with some files already (like
the `_src` folder). Hint: this can also be used to create a password-
protected area on the page.


### How can I change the find-your-politician app?

The app source is located in `_src/apps/addresses`. It's a "Svelte"
app which is a template language that compiles to JavaScript. To
compile the app you need to run

    cd _src/apps/addresses
    npm install
    npm run build

The `npm install` is only needed the first time you compile the app.

The addresses themselves are stored in `_src/data/addresses.json`.
If you make changes to the files you also need to re-compile the
Svelte app (same command as above).

If you want to learn more about Svelte, check out the website at
https://svelte.dev/. There's also a nice tutorial that walks through
the features.
