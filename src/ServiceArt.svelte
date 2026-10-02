<script lang="ts">
 let {kind='report'}:{kind?:'report'|'conversation'}=$props();
</script>
<div class="service-art" aria-hidden="true">
<svg viewBox="0 0 560 220" fill="none" xmlns="http://www.w3.org/2000/svg">
 {#if kind==='report'}
 <path d="M0 55H560M0 162H560M95 0V220M430 0V220" stroke="#f7f6ed" stroke-width="18"/>
 <path d="M0 105H560M220 0V220" stroke="#c6d2c8" stroke-width="1" stroke-dasharray="4 5"/>
 <rect x="130" y="24" width="235" height="175" rx="8" fill="#faf9f0" stroke="#aebeb3"/>
 <path d="M153 48H240M153 63H204" stroke="#163d4c" stroke-width="5" stroke-linecap="round"/>
 <rect x="153" y="85" width="189" height="68" rx="3" fill="#e1e9da"/>
 <path d="M165 124L189 113L219 129L250 101L280 109L322 94" stroke="#68876c" stroke-width="2"/>
 <path d="M153 173H237M153 183H206" stroke="#acb9ad" stroke-width="3"/>
 <circle cx="367" cy="101" r="49" fill="#d8b67a" stroke="#faf9f0" stroke-width="7"/>
 <path d="M367 73C355 73 348 82 348 92C348 106 367 124 367 124S386 106 386 92C386 82 379 73 367 73Z" stroke="#173d4c" stroke-width="2.5"/>
 <circle cx="367" cy="91" r="7" stroke="#173d4c" stroke-width="2.5"/>
 {:else}
 <rect x="74" y="49" width="212" height="127" rx="8" fill="#f9f8ee" stroke="#aebeb3"/>
 <path d="M97 86H168M97 103H238M97 119H211" stroke="#b9c7ba" stroke-width="5" stroke-linecap="round"/>
 <path d="M97 144H140" stroke="#bc9657" stroke-width="5" stroke-linecap="round"/>
 <rect x="248" y="76" width="225" height="113" rx="8" fill="#173d4c"/>
 <path d="M287 111H396M287 129H434M287 147H367" stroke="#b9ccc8" stroke-width="4" stroke-linecap="round"/>
 <path d="M419 185V204L444 185" fill="#173d4c"/>
 <circle cx="442" cy="52" r="28" fill="#d8b67a"/>
 <path d="M429 53L438 61L455 43" stroke="#173d4c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
 {/if}
</svg>
</div>
