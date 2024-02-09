<script lang="ts">
  import Tab from "./Tab.svelte";
  import {MetadataCache, Vault} from "obsidian";
  import queryFilter from "../lib/query";
  import YAML from 'yaml'

  let input: string = "";
  export let vault:Vault;
  export let metadata: MetadataCache;

  export let source: string = "";
  export let path:string = "";
  let activeTab = 0;

  interface Config {
    tabs: Tab[];
  }
  interface Tab {
    name: string;
    path: string;
    query: string;
    list: any[];
    color?: string;
  }
  let data = [];
  let cfg:Config = {
    tabs: []
  }
  let error = "";
  try{
    data = YAML.parse(source)
    cfg = data as Config;
    cfg.tabs.map((tab)=>{
      tab.list = queryFilter(vault.getMarkdownFiles().filter(f=>f.path.startsWith(tab.path)).map((f) => {
        return{
          ...metadata.getFileCache(f)?.frontmatter,
          path: f.path,
          name: f.basename,
          ctime: f.stat.ctime,
          mtime: f.stat.mtime,
        }
      }), tab.query)
    })
    console.log(cfg)
  } catch (e) {
    error = e.toString();
  }

</script>

{#if error}
  <div class="error">
    {error}
  </div>
{:else}
  <div class="obsilist">
    <div class="tab-bar">
      {#each cfg.tabs as tab,idx}
        <button style=""
                class="tab-name {idx===activeTab?'active':''}" on:click={()=>{activeTab=idx}}>{tab.name}</button>
      {/each}
    </div>
    {#each cfg.tabs as tab,idx}
      {#if idx === activeTab}
        <Tab tab={tab}/>
      {/if}
    {/each}
  </div>
{/if}

<style>
  .obsilist {
    background-color: #232323;
    border: 1px solid #181818;
    border-radius: 5px;
    padding: 5px;
  }
  .tab-bar {
    display: flex;
    padding: 5px;
    gap: 5px;
    background: #1f1f1f;
  }
  .tab-name {
    text-align: center;
    /*background-color: #696969;*/
  }
  .tab-name.active {
    background-color: #696969;
  }

  .error {
    color: red;
    font-size: 15px;
    background: #232323;
    padding: 10px;
  }
</style>
