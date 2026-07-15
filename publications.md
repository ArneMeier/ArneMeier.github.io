---
layout: homepage
title: Publications
permalink: /publications/
---

<div class="pub-controls">
  <div class="pub-search-wrap">
    <span class="pub-search-icon">&#128269;</span>
    <input type="text" id="pub-search" placeholder="Search by title, author, venue…" autocomplete="off" spellcheck="false" />
    <button class="pub-search-clear" id="pub-search-clear" aria-label="Clear search" style="display:none;">&#10005;</button>
  </div>
  <div class="pub-filter-btns">
    <button class="filter-btn active" data-section="all">All <span class="filter-count" id="count-all"></span></button>
    <button class="filter-btn" data-section="section-conf">Conference <span class="filter-count" id="count-conf"></span></button>
    <button class="filter-btn" data-section="section-journal">Journal <span class="filter-count" id="count-journal"></span></button>
    <button class="filter-btn" data-section="section-editorial">Editorships <span class="filter-count" id="count-editorial"></span></button>
    <button class="filter-btn" data-section="section-theses">Theses <span class="filter-count" id="count-theses"></span></button>
  </div>
  <div class="pub-tag-cloud" id="pub-tag-cloud">
    <!-- wird dynamisch per JS befüllt -->
  </div>
</div>

<div class="pub-results-info" id="pub-results-info" style="display:none;">
  <span id="pub-count-num">0</span> result(s) for &ldquo;<em id="pub-query-text"></em>&rdquo;
</div>

<div class="pub-section" id="section-conf">
  <h2>Conference Papers</h2>
  {% bibliography --file My_Conference_Publications %}
</div>

<div class="pub-section" id="section-journal">
  <h2>Journal Articles</h2>
  {% bibliography --file My_Journal_Publications %}
</div>

<div class="pub-section" id="section-editorial">
  <h2>Editorships</h2>
  {% bibliography --file My_Editorship %}
</div>

<div class="pub-section" id="section-theses">
  <h2>Theses</h2>
  {% bibliography --file My_Thesis %}
</div>
