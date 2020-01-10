<script>
    export let addresses = [];
    export let language = 'en';
    import uniq from 'lodash-es/uniq';

    $:districts = uniq(addresses.map(d => d.district));
    $:districtFiltered = filterDistrict ? addresses.filter(d => d.district === filterDistrict) : [];

    $:parties = uniq(districtFiltered.map(d => d.party)).sort();
    $:partyFiltered = filterParty ? districtFiltered.filter(d => d.party === filterParty) : [];

    $:sortedNames = partyFiltered.sort((a,b) => a.name > b.name ? 1 : -1);
    let filterDistrict = false;
    let filterParty = false;

    const texts = {
        selectDistrict: {
            en: 'Select your district',
            de: 'Wähle deinen Stadtbezirk'
        },
        selectParty: {
            en: 'Select a party',
            de: 'Wähle eine Partei'
        },
        selectPolitician: {
            en: 'Find a politician',
            de: 'Wähle einen Abgeordneten'
        }
    };
</script>

<style>
    .card {
        background: #eee;
        margin: 0 10px 10px 0;
        display: inline-block;
        width: 200px;
        padding: 20px;
        vertical-align: top;
    }
    .card .name {
        font-weight: bold;
        margin-bottom: 3px;
    }
    a {
        display: inline-block;
        margin: 0 1em 1ex 0;
    }

    a.selected {
        color: black;
        font-family: Fucxed;
        text-transform: uppercase;
        background: #DC4F00;
        color: white;
        font-size: 1.3em;
        padding: 5px 8px;
        text-decoration: none
    }
</style>

<h3 id="addresses">1. {texts.selectDistrict[language]}</h3>
<p>
    {#each districts as district}
    <a class:selected={filterDistrict === district} on:click|preventDefault={() => filterDistrict = district} href="#berlin-postcard-special">{district}</a>
    {/each}
</p>
{#if filterDistrict}
    <h3 id="select-party">2. {texts.selectParty[language]}</h3>
    <p>
        {#each parties as party}
        <a class:selected={filterParty === party} on:click|preventDefault={() => filterParty = party} href="#berlin-postcard-special">{party}</a>
        {/each}
    </p>
    {#if filterDistrict && filterParty}
    <h3 id="find-address">3. {texts.selectPolitician[language]}</h3>
    <div class="cards">
    {#each sortedNames as person}
        <div class="card">
            <div class="name">{person.forename} {person.name}</div>
            <div class="address">
                    {person.address}<br>
                    {person.street}<br>
                {person.zip}
            </div>
        </div>
    {/each}
    </div>
    {/if}
{/if}
