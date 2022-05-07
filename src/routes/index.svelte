<script>
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
      users = users.sort((a,b) => a[key] > b[key] ? 1 : (a[key] < b[key] ? -1 : 0))
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
    {#each users[0] ? Object.keys(users[0]) : [] as key}
    <th on:click={() => sortBy(key)} class:selected={key === selectedKey}>{key}</th>
    {/each}
  </tr>
  {#each hideGuests ? users.filter(u => !u.guest) : users as user}
  <tr>
    {#each Object.values(user) as value}
    <td>{value}</td>
    {/each}
  </tr>
  {/each}
</table>

<style>
  .selected {
    background-color: darkcyan;
    color: beige;
  }
</style>