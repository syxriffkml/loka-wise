<svg class="home-map-art" viewBox="0 0 360 220" fill="none" aria-hidden="true">
  <rect width="360" height="220" rx="8" fill="#e7e8d9"/>
  <!-- Stylised blocks and roads, not a geographic map or measured catchment. -->
  <g fill="#cdd5bf" stroke="#b9c5ad" stroke-width=".7">
    <rect x="10" y="12" width="64" height="39" rx="3"/>
    <rect x="87" y="12" width="64" height="39" rx="3"/>
    <rect x="165" y="12" width="87" height="39" rx="3"/>
    <rect x="266" y="12" width="83" height="39" rx="3"/>
    <rect x="10" y="65" width="64" height="57" rx="3"/>
    <rect x="87" y="65" width="64" height="57" rx="3"/>
    <rect x="165" y="65" width="87" height="57" rx="3"/>
    <rect x="266" y="65" width="83" height="57" rx="3"/>
    <rect x="10" y="136" width="64" height="72" rx="3"/>
    <rect x="87" y="136" width="64" height="72" rx="3"/>
    <rect x="165" y="136" width="87" height="72" rx="3"/>
    <rect x="266" y="136" width="83" height="72" rx="3"/>
  </g>
  <g stroke="#f8f3e3" stroke-width="11">
    <path d="M0 58H360M0 129H360M80 0V220M158 0V220M259 0V220"/>
    <path d="M28 232L167 -12" stroke-width="23"/>
  </g>
  <path d="M28 232L167 -12" stroke="#d7cba8" stroke-width="1.2" stroke-dasharray="6 7"/>
  <g fill="#b5c3a3">
    <rect x="19" y="22" width="19" height="19" rx="2"/><rect x="44" y="22" width="20" height="19" rx="2"/>
    <rect x="177" y="23" width="29" height="17" rx="2"/><rect x="213" y="23" width="27" height="17" rx="2"/>
    <rect x="278" y="76" width="26" height="33" rx="2"/><rect x="311" y="76" width="26" height="33" rx="2"/>
    <rect x="177" y="148" width="29" height="45" rx="2"/><rect x="214" y="148" width="25" height="45" rx="2"/>
  </g>
  <g fill="#a4b897" stroke="#94aa87" stroke-width="1">
    <circle cx="286" cy="172" r="10"/><circle cx="303" cy="184" r="12"/><circle cx="326" cy="166" r="11"/>
  </g>
  <circle cx="210" cy="103" r="42" fill="#ddbd7240" stroke="#b18b48" stroke-width="1.4"/>
  <rect x="183" y="91" width="54" height="24" rx="12" fill="#fbf6e7" stroke="#b18b48" stroke-width=".8"/>
  <text x="210" y="107" fill="#0b3046" text-anchor="middle" font-family="inherit" font-size="13" font-weight="700">SS15</text>
  {#each [[99,50],[289,128],[122,184]] as [x,y]}
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="2" rx="10" ry="3" fill="#173d3426"/>
      <path d="M0 1C-3-4-12-12-12-20a12 12 0 1 1 24 0C12-12 3-4 0 1Z" fill="#42715c" stroke="#fffbed" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="0" cy="-20" r="4" fill="#fffbed"/>
    </g>
  {/each}
</svg>
