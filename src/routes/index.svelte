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

const getUsers = async () => {
  if (!browser) return
  const res = await fetch('/users.json')
  const _users = await res.json()
  users = _users
  selectedKey = null
  console.log(`${users.length} users loaded.`)
}

const sortUsers = () => {
  users = users.sort((a,b) => a.nb_connexions - b.nb_connexions)
}

const sortBy = (/** @type {string} */ key) => {
  if (selectedKey && selectedKey === key) {
    users = users.reverse()
  } else {
    selectedKey = key
    if (key === 'nb_connexions') {
      sortUsers()
    } else {
      users = users.sort((/** @type {any} */ a, /** @type {any} */ b) => a[key] > b[key] ? 1 : (a[key] < b[key] ? -1 : 0))
    }
  }
}

getUsers()
</script>

<h1>BeamMP Users</h1>
<span>{`${(hideGuests ? users.filter(u => !u.guest) : users).length} users loaded.`}</span>
<button on:click={getUsers}>Refresh</button>
<input type="checkbox" bind:checked={hideGuests}/> hide guests

<table>
  <tr>
    {#each users[0] ? (hideGuests ? Object.keys(users[0]).filter(key => key !== 'guest') : Object.keys(users[0])) : [] as key}
    <th on:click={() => sortBy(key)} class:selected={key === selectedKey}>{key}</th>
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
    text-align: left;
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