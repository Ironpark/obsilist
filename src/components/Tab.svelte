<script lang="ts">
    import Field from "./Field.svelte";
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();
    interface Tab {
        name: string;
        path: string;
        query: string;
        list: any[];
        color?: string;
        fields?: string[];
    }
    export let tab: Tab = {
        name: 'tab',
        path: '',
        query: '',
        list: []
    }
    if(!tab.fields){
        tab.fields = ['name', 'tags', 'mtime'];
    }

</script>

<div class="tab">
    <div class="list">
        {#each tab.list as item}
            <div class="item" on:click={()=>{
                dispatch('itemClick', item)
            }}>
                {#each tab.fields as field}
                    <Field field={field} value={item[field]} />
                {/each}
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
  .tab {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .item {
    background: #2c2c2c;
    display: flex;
    flex-direction: row;
    gap: 10px;
    padding: 10px;
    border-radius: 3px;
    font-size: 13px;
    align-items: center;
    margin: 5px;
    .spacer{
      flex: 1;
    }
    &:hover {
      background: #3c3c3c;
    }
  }
</style>
