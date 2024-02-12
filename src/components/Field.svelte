<script lang="ts">
    export let field: string;
    export let value: any;
    const isDateField = ['mtime', 'ctime', 'datetime'].includes(field)
    const isArrayField = Array.isArray(value)
</script>

<div class="{field}">
{#if isDateField}
    <span>{new Date(value).toLocaleDateString()}</span>
{:else if isArrayField}
        {#each value as item}
            <span class="tag">{item}</span>
        {/each}
{:else}
    <span>{value?value:''}</span>
{/if}
</div>
<style>
    .tag {
        display: inline-block;
        padding: 0.1rem 0.25rem;
        margin: 0.1rem;
        background-color: #0058bb;
        border-radius: 0.25rem;
    }
    .name{
        font-weight: bold;
    }
</style>