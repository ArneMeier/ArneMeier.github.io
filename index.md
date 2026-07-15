---
layout: homepage
---

## Hello, nice to have you here.

I am a professor at the [Gottfried Wilhelm Leibniz Universität Hannover](https://www.uni-hannover.de), Germany.
I head the research group [Algorithms](https://www.thi.uni-hannover.de/en/rg-algo).
I obtained my Bachelor's and Master's Degrees in Computer Science as well as my PhD and Habilitation at [Gottfried Wilhelm Leibniz Universität Hannover](https://www.uni-hannover.de), Germany.

## Research Interests (alphabetical order)

- **Argumentation:** abstract as well as logic-based
- **Artificial Intelligence:** logical foundations
- **Complexity Theory:** algorithmic complexity, parameterised complexity
- **Enumeration:** parameterised enumeration, enumeration complexity
- **Logic in Computer Science:** non-classical, non-monotonic, team, temporal, hybrid, modal, default, and autoepistemic logic

## News

{% if site.data.news.size > 0 %}
<ul class="news-list">
{% for item in site.data.news %}
  <li><strong>[{{ item.date }}]</strong> {{ item.html }}</li>
{% endfor %}
</ul>
{% endif %}

## Recent Papers

{% bibliography --file My_Conference_Publications --max 5 --template news-bib %}

<p style="margin-top: 0.5rem;">
  <a href="/publications/" class="view-all-link">View all publications &rarr;</a>
</p>

## Projects

<h4 style="margin:0 10px 0;">Active</h4>

<ul style="margin:0 0 5px;">
  <li>
    <div class="hfillstretch">
      <div><autocolor>[<a href="https://rse.org.uk/rse-awards-provide-over-856k-boost-to-scotlands-research-sector/" target="_blank">RSE-DAAD</a>] Fine-grained complexity classification of CQA</autocolor></div>
      <div><font color="darkgreen">['26 &minus; '27]</font></div>
    </div>
  </li>
  <li>
    <div class="hfillstretch">
      <div><autocolor>[<a href="https://www.dfg.de" target="_blank">DFG</a>] <a href="https://gepris.dfg.de/gepris/projekt/511769688" target="_blank">Team Logics: New Bridges to Database Repairs</a></autocolor></div>
      <div><font color="darkgreen">[05'23 &minus; 06'26]</font></div>
    </div>
  </li>
</ul>

<h4 style="margin:0 10px 0;">Finished</h4>
<ul style="margin:0 0 20px;">
  <li>
    <div class="hfillstretch">
      <div><autocolor>[<a href="https://www.daad.de/de/infos-services-fuer-hochschulen/weiterfuehrende-infos-zu-daad-foerderprogrammen/ppp/" target="_blank">DAAD</a>] Anwendungen und Komplexität von Logiken in der Semiring-Team-Semantik</autocolor></div>
      <div><font color="darkgreen">['24 &minus; '25]</font></div>
    </div>
  </li>
  <li>
    <div class="hfillstretch">
      <div><autocolor>[<a href="https://www.daad.de" target="_blank">DAAD</a>] Descriptive Complexity of Parameterised Counting Classes</autocolor></div>
      <div><font color="darkgreen">[01'18 &minus; 12'19]</font></div>
    </div>
  </li>
  <li>
    <div class="hfillstretch">
      <div><autocolor>[<a href="https://www.dfg.de" target="_blank">DFG</a>] <a href="https://gepris.dfg.de/gepris/projekt/247444366" target="_blank">Nonclassical logics: parametrised and enumeration complexity</a></autocolor></div>
      <div><font color="darkgreen">[10'13 &minus; 07'22]</font></div>
    </div>
  </li>
  <li>
    <div class="hfillstretch">
      <div><autocolor>[<a href="https://www.mwk.niedersachsen.de/startseite/" target="_blank">MWK</a>] Innovation Plus: Komplexität von Algorithmen</autocolor></div>
      <div><font color="darkgreen">[02'20 &minus; 09'22]</font></div>
    </div>
  </li>
</ul>
