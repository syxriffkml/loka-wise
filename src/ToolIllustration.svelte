<script lang="ts">
  let { kind = 'map' }: { kind?: 'map' | 'report' | 'conversation' | 'business' | 'workspace' } = $props();
</script>

<svg class="tool-illustration" viewBox="0 0 160 112" fill="none" aria-hidden="true">
  <ellipse cx="80" cy="98" rx="65" ry="7" fill="#0b3046" opacity=".06"/>
  {#if kind === 'map'}
    <path d="m14 30 43-13 46 14 43-13v68l-43 13-46-14-43 13Z" fill="#f4efdf" stroke="#0b3046" stroke-width="2" stroke-linejoin="round"/>
    <path d="M57 17v68m46-54v68M15 67l41-13 46 14 43-13" stroke="#c8c5b5" stroke-width="2"/>
    <path d="m37 71 38-14 42 18" stroke="#b78b40" stroke-width="3" stroke-dasharray="4 6"/>
    <g class="illustration-accent"><path d="M105 38c0 16-21 34-21 34S63 54 63 38a21 21 0 1 1 42 0Z" fill="#d9b673" stroke="#0b3046" stroke-width="2"/><circle cx="84" cy="38" r="7" fill="#fffdf7" stroke="#0b3046" stroke-width="2"/></g>
  {:else if kind === 'report'}
    <rect x="32" y="18" width="79" height="82" rx="5" fill="#e6e9e2" stroke="#0b3046" stroke-width="2"/>
    <rect x="43" y="9" width="79" height="82" rx="5" fill="#fffdf7" stroke="#0b3046" stroke-width="2"/>
    <path d="M55 26h29M55 36h51M55 45h38" stroke="#0b3046" stroke-width="3" stroke-linecap="round"/>
    <path d="M57 78V62h10v16m9 0V54h10v24m9 0V65h10v13" fill="#d9b673"/>
    <g class="illustration-accent"><circle cx="123" cy="75" r="22" fill="#f0e3c5" stroke="#0b3046" stroke-width="2"/><path d="m113 75 7 7 14-16" stroke="#0b3046" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>
  {:else if kind === 'conversation'}
    <path d="M22 20h80a9 9 0 0 1 9 9v32a9 9 0 0 1-9 9H52L29 86V70h-7a9 9 0 0 1-9-9V29a9 9 0 0 1 9-9Z" fill="#fffdf7" stroke="#0b3046" stroke-width="2"/>
    <path d="M40 36h43M40 47h30" stroke="#0b3046" stroke-width="3" stroke-linecap="round"/>
    <path class="illustration-accent" d="M87 49h50a9 9 0 0 1 9 9v23a9 9 0 0 1-9 9h-5v14l-21-14H87a9 9 0 0 1-9-9V58a9 9 0 0 1 9-9Z" fill="#d9b673" stroke="#0b3046" stroke-width="2"/>
    <path d="M95 66h34M95 76h22" stroke="#0b3046" stroke-width="3" stroke-linecap="round"/>
  {:else if kind === 'workspace'}
    <path d="M19 38V27a6 6 0 0 1 6-6h38l12 13h55a6 6 0 0 1 6 6v51H19Z" fill="#e7d7b5" stroke="#0b3046" stroke-width="2" stroke-linejoin="round"/>
    <rect x="37" y="11" width="66" height="71" rx="4" transform="rotate(-7 37 11)" fill="#fffdf7" stroke="#0b3046" stroke-width="2"/>
    <path d="m49 28 36-4m-35 15 24-3m-23 16 37-4" stroke="#9daea1" stroke-width="3" stroke-linecap="round"/>
    <path d="M16 46h49l10 10h67l-8 39H23Z" fill="#d9b673" stroke="#0b3046" stroke-width="2" stroke-linejoin="round"/>
    <path d="M37 70h37m-37 9h25" stroke="#0b3046" stroke-width="2" stroke-linecap="round"/>
    <g class="illustration-accent"><circle cx="125" cy="33" r="22" fill="#eef1e7" stroke="#0b3046" stroke-width="2"/><path d="m115 33 7 7 14-16" stroke="#0b3046" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>
  {:else}
    <path d="M30 39h100v56H30Z" fill="#fffdf7" stroke="#0b3046" stroke-width="2"/>
    <path d="m23 40 12-24h90l12 24" fill="#d9b673" stroke="#0b3046" stroke-width="2" stroke-linejoin="round"/>
    <path d="M23 40v7c0 11 19 11 19 0 0 11 19 11 19 0 0 11 19 11 19 0 0 11 19 11 19 0 0 11 19 11 19 0 0 11 19 11 19 0v-7" fill="#f0e3c5" stroke="#0b3046" stroke-width="2"/>
    <path d="M94 95V62h23v33M43 62h36v21H43Z" fill="#e6e9e2" stroke="#0b3046" stroke-width="2"/>
    <path d="M21 96h118" stroke="#0b3046" stroke-width="2" stroke-linecap="round"/>
  {/if}
</svg>
