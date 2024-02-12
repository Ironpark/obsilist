<script lang="ts">
  import Tab from "./Tab.svelte";
  import {MetadataCache, Vault} from "obsidian";
  import queryFilter from "../lib/query";
  import YAML from 'yaml'
  import { App } from "obsidian";

  let input: string = "";
  export let vault:Vault;
  export let app:App;
  export let metadata: MetadataCache;

  export let source: string = "";
  export let path:string = "";
  let activeTab = 0;

  const openFile = (file:string) => {
    let leaf = app.workspace.getMostRecentLeaf();
    const targetFile = vault
            .getMarkdownFiles()
            .find((f) => f.path === file);
    if(targetFile && leaf)
      leaf.openFile(targetFile);
  }
  interface Config {
    title?: string;
    tabs: Tab[];
    fields?: string[];
  }
  interface Tab {
    name: string;
    path: string;
    query: string;
    list: any[];
    color?: string;
    fields?: string[];
    style?: string;
  }
  let data = [];
  let cfg:Config = {
    title: "",
    tabs: []
  }
  let error = "";
  try{
    data = YAML.parse(source)
    cfg = data as Config;
    cfg.tabs.map((tab)=>{
      if(!tab.fields){
        if(cfg.fields){
          tab.fields = cfg.fields
        }
      }
      if(tab.color){
        switch (tab.color){
          case "red":
            tab.style = "--tab-active-color: #a60000; --tab-default-color: #680000;";
            break;
          case "green":
            tab.style = "--tab-active-color: rgb(5 163 55); --tab-default-color: rgb(22 79 40);";
            break;
          case "blue":
            tab.style = "--tab-active-color: #0000ff; --tab-default-color: #0000ff;";
            break;
          default:
            break;
        }
      }
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
    <div class="header">
      {#if cfg.title}
        <h2 class="title">{cfg.title}</h2>
      {/if}
      <div class="tab-bar">
        {#each cfg.tabs as tab,idx}
          <button class="tab-name {idx===activeTab?'active':''}" style="{tab.style}" on:click={()=>{activeTab=idx}}>{tab.name}</button>
        {/each}
      </div>
    </div>
    {#each cfg.tabs as tab,idx}
      {#if idx === activeTab}
        <Tab tab={tab} on:itemClick={(e)=>{
            openFile(e.detail.path)
        }} />
      {/if}
    {/each}
  </div>
{/if}

<style lang="scss">
  :root {
    --tab-active-color: #2f2f2f;
    --tab-default-color: #1f1f1f;
  }
  .obsilist {
    background-color: #232323;
    border: 1px solid #181818;
    border-radius: 5px;
  }
  .tab-bar {
    display: flex;
    padding: 5px;
    gap: 5px;
  }
  .tab-name {
    text-align: center;
    background-color: var(--tab-default-color);
    &.active {
      background-color: var(--tab-active-color);
    }
  }
  .header{
    display: flex;
    flex-direction: column;
    background: #1f1f1f;
  }
  .title {
    margin: 0;
    padding: 10px;
  }
  .error {
    color: red;
    font-size: 15px;
    background: #232323;
    padding: 10px;
  }
</style>
