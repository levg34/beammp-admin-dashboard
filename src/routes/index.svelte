<script>
import { browser } from '$app/env'
/**
* @type {import("src/types").User[]}
*/
let users = []
/**
* @type {string | null}
*/
let selectedKey = null
let hideGuests = false
let sortUp = false

const getUsers = async () => {
  if (!browser) return
  const res = await fetch('/users')
  const _users = await res.json()
  users = _users.users
  selectedKey = null
  sortUp = false
  console.log(`${users.length} users loaded.`)
}

const sortUsers = () => {
  users = users.sort((a,b) => a.nb_connexions - b.nb_connexions)
}

const sortBy = (/** @type {string} */ key) => {
  if (selectedKey && selectedKey === key) {
    users = users.reverse()
    sortUp = !sortUp
  } else {
    selectedKey = key
    sortUp = false
    if (key === 'nb_connexions') {
      sortUsers()
    } else {
      users = users.sort((/** @type {any} */ a, /** @type {any} */ b) => a[key] > b[key] ? 1 : (a[key] < b[key] ? -1 : 0))
    }
  }
}

getUsers()
</script>

<svelte:head>
  <title>BeamMP Users</title>
</svelte:head>

<span>{`${(hideGuests ? users.filter(u => !u.guest) : users).length} users loaded.`}</span>
<button on:click={getUsers}>Refresh</button>
<input type="checkbox" bind:checked={hideGuests}/> hide guests

<table>
  <tr>
    {#each users[0] ? (hideGuests ? Object.keys(users[0]).filter(key => key !== 'guest') : Object.keys(users[0])) : [] as key}
    <th on:click={() => sortBy(key)} class:selected={key === selectedKey}>
      {key.replace(/_/g,' ')}
      {#if key === selectedKey}
        {#if sortUp}
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-sort-ascending" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <desc>Download more icon variants from https://tabler-icons.io/i/sort-ascending</desc>
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <line x1="4" y1="6" x2="11" y2="6"></line>
          <line x1="4" y1="12" x2="11" y2="12"></line>
          <line x1="4" y1="18" x2="13" y2="18"></line>
          <polyline points="15 9 18 6 21 9"></polyline>
          <line x1="18" y1="6" x2="18" y2="18"></line>
       </svg>
        {:else}
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-sort-descending" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <desc>Download more icon variants from https://tabler-icons.io/i/sort-descending</desc>
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <line x1="4" y1="6" x2="13" y2="6"></line>
          <line x1="4" y1="12" x2="11" y2="12"></line>
          <line x1="4" y1="18" x2="11" y2="18"></line>
          <polyline points="15 15 18 18 21 15"></polyline>
          <line x1="18" y1="6" x2="18" y2="18"></line>
       </svg>
        {/if}
      {/if}
    </th>
    {/each}
  </tr>
  {#each hideGuests ? users.filter(u => !u.guest) : users as user}
  <tr>
    {#each hideGuests ? Object.entries(user).filter(([key,value]) => key !== 'guest').map(([key,value]) => value) : Object.values(user) as value}
    <td>{value}</td>
    {/each}
  </tr>
  {/each}
</table>

<style>
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  td, th {
    border: 1px solid #dddddd;
    text-align: center;
    padding: 8px;
  }

  tr:nth-child(even) {
    background-color: #dddddd;
  }

  .selected {
    background-color: darkcyan;
    color: beige;
  }
</style>