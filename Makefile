# ── Makefile for ArneMeier website ─────────────────────────
# The LANG/LC_ALL export ensures bibtex-ruby reads .bib files
# as UTF-8 (required for author names with diacritics).

export LANG    := en_US.UTF-8
export LC_ALL  := en_US.UTF-8

.PHONY: build serve clean

## build : Generate the static site into _site/
build:
	bundle exec jekyll build

## serve : Start local dev server at http://localhost:4000
serve:
	bundle exec jekyll serve --livereload

## clean : Remove the generated _site/ directory
clean:
	bundle exec jekyll clean
