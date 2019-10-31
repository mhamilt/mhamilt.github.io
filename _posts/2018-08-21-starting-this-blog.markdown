---
layout: post
title:  "Starting a Jekyll Blog on GitHub Pages"
date:   2018-08-21 14:00:31 +0100
categories: blog
tags: github-pages jekyll
---

<p><span class="firstcharacter">A</span>fter only a couple of hours this is actually up and running. The main hurdle for setting up GitHub pages is gathering all the little bits and pieces together. In that sense it is more a quick succession of tiny hurdles than any one large creative leap.</p>

To get started on this you are going to need to do a few things. Some of these are dependant on your setup so I have listed the sub-steps that also need to be taken. This is all written from the perspective of macOS.

***

### Workflow

Pages Repository = `USERNAME.github.io` repository


* Setup GitHub Pages
    * Get a GitHub account
    * [Create a pages repository](https://pages.github.com)
        * Clone Pages repository to your computer `git clone https://github.com/username/username.github.io`
        * [Download GitHub Desktop](https://desktop.github.com)
* Create a Jekyll Site in your Pages Repository with Terminal:
    * Install Jekyl Bundler `gem install jekyll bundler`
        * Install xcode tools: `xcode-select --install`
        * install/update ruby: `\curl -sSL https://get.rvm.io | bash -s stable`
            * `rvm install ruby-2.4`
        * update RubyGem: `gem install rubygems-update`
    * change directory to the location of Pages Repository
    * type `jekyll new .`

* *_If you want to use a custom domain_*
    * Register your domain name
    * In Pages Repository: [go to settings](https://help.github.com/articles/adding-or-removing-a-custom-domain-for-your-github-pages-site/) and change custom domain to `www.yourdomain`
        * yourdomain is the domain name you have registered `example.com`, `example.io`,`example.co.uk`
    * Create a `CNAME` record on the site of the company with whom you registered your domain
    * When altering the `CNAME` record, change the following
        * host: `www` (or something like `blog`)
        * points to: `github_username.github.io`

With the install of all the command line tools and updating packages, it could take a while to get this all finished.

Run server and test site with `bundle exec jekyll serve`

***

### Shell Script

{% highlight bash %}
##########################################
# EDIT THESE
USERNAME="YOUR_USERNAME"
REPOSITORY="$USERNAME.github.io"
GITHUB_FOLDER="~/Documents/GitHub/"
REPOSITORY_PATH="$GITHUB_FOLDER$REPOSITORY"
##########################################
xcode-select --install
git clone "https://github.com/$USERNAME/$REPOSITORY"
curl -sSL https://get.rvm.io | bash -s stable
rvm install ruby-2.4
gem install rubygems-update
gem install jekyll bundler
cd REPOSITORY_PATH
jekyll new .
##########################################
# EOF
{% endhighlight %}

***

### Helpful References

* [Jekyll Quick Start Guide](https://jekyllrb.com/docs/quickstart/)
* [Kramdown Reference](https://kramdown.gettalong.org/quickref.html)
