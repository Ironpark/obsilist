<script lang="ts">
    interface Tab {
        name: string;
        path: string;
        query: string;
        list: any[];
        color?: string;
    }
    export let tab: Tab = {
        name: 'tab',
        path: '',
        query: '',
        list: []
    }
</script>

<div class="tab">
    <div class="list">
        {#each tab.list as item}
            <div class="item">
                <div class="name">
                    <span>{item.name}.md</span>
                </div>
                <div class="name">
                    <span>{item.mtime}</span>
                </div>
                <div class="tags">
                    {#each item.tags as tag}
                        <span class="tag">{tag}</span>
                    {/each}
                </div>
                <div class="spacer"></div>
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
  .tab {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
  }
  .item {
    display: flex;
    flex-direction: row;
    gap: 10px;
    padding: 5px;
    border-radius: 5px;
    font-size: 13px;
    .name{
      /* 상하좌우 정중앙 정렬하기 */
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .spacer{
      flex: 1;
    }
  }
    .tags {
      display: flex;
      flex-direction: row;
      gap: 5px;
      .tag {
        padding: 2px 5px;
        border-radius: 5px;
        background: #14438c;
        font-size: 10px;
        margin: auto 0;
      }
    }
    .actions {
      display: flex;
      flex-direction: row;
      gap: 5px;

      button {
        padding: 5px 10px;
        border-radius: 5px;
        background: #14438c;
        color: white;
        font-size: 10px;
      }
    }
</style>
