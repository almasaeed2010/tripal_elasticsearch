# tripal_elasticsearch

`tripal_elasticsearch` is a drupal module which integrates the powerful search engine [elasticsearch](https://www.elastic.co/) with drupal sites, providing general site-wide indexing and search, as well as specific indexing and search for any number of drupal and chado tables. It also provides an easy way to build search interface for individual drupal and chado tables after these tables are elastic-indexed. 

## The dependencies of `tripal_elasticsearch`
* The module `tripal_elasticsearch` depends on the search engine `elasticsearch`. So you need to install [`elasticsearch`](https://www.elastic.co/downloads/elasticsearch) to run this module. 
* This module use `elasticsearch-php client` library to interact with `elasticsearch`. So you will need to install this library. However, when you install this module, it will come with the `elasticsearch-php client` library.

## Install elasticsearch
### Elasticsearch requires php version > 5.3.9

* check your php version: `php -v`

### Download elastic to your drupal site server
```
cd path/to/the/same/level/of/your/drupal/site/root
sudo wget https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-1.7.1.tar.gz
```

### Extract the files
```
tar -xvf elasticsearch-1.7.1.tar.gz
```

### Change the ownership of elasticsearch directory from `root` to `yourusername`
Elasticsearch doesn't run as root, so change the ownership from `root` to anything else.
```
chown -R username:username elasticsearch-1.7.1
```

### Configure `elasticsearch.yml`

* `cd elasticsearch-1.7.1/config`
* Open the configuration file: `vi elasticsearch.yml`
* Find the line starting with `#network.host:` and add `network.host: localhost` below it

### Start and stop elasticsearch
* To start: `cd elasticsearch-1.7.1` and `bin/elasticsdearch`
* To stop: `ctrl+c`

### [Run elasticsearch on the backgroud](https://www.elastic.co/guide/en/elasticsearch/reference/current/setup.html)
* `cd elasticsearch-1.7.1`
* `bin/elasticsdearch -d`


`tripal_elasticsearch` module can index any chado tables and make data in chado tables searchable. It intearacts with the databases directly, so it is independent of Tripal. 


## Install `tripal_elasticsearch` module
* Install the module as a custom module: `cd sites/all/modules/custom`
* Download the module `wget https://github.com/tripal/tripal_elasticsearch.git`
* Run drush command to install: `drush en tripal_elasticsearch -y`

__Currently this module is customized for the [hardwood genomics database](hardwoodgenomics.org). You can still install and run this module. But you may see some warning messages.__

## Site-wide indexing
* Go to __/admin/config/elastic\_search__
* Select __index_website__ from the dropdown table list and then click on the submit button

You will see the page is loading. Do not close the page until the loading is finished. A cron queue is being created during this process. This may take one or two minitues depending on how many nodes your website has.

![index_website](https://github.com/MingChen0919/elastic_search_documentation/blob/elastic_search-to-github/images/index_website_not_exist.png)

Once the cron queue building is done, the site-wide indexing process will run in the background.

## Specific database tables indexing
Specific database tables indexing allows user to do:
* select any tables from the drupal public databases or chado databases to index
* index joined tables to combine data from different tables
* select any number of fields from indexed tables for search

* Go to __/admin/config/search/elastic_search/indexing__
* Select a table from the dropdown
* select fields from the table that you want to index
* click `Elasticindex` button

![specific database tables indexing](https://github.com/MingChen0919/elastic_search_documentation/blob/elastic_search-to-github/images/specific-database-table-index.png)

### Build search block for indexed tables
* Go to __/admin/config/search/elastic_search/search_block_builder__
* Select a table from the dropdown. All these tables are indexed tables
* Select fields that you want to give users searching access
* Enter a unique name for this block. The block name can only contain letters and numbers, starting with letters

![build search block](https://github.com/MingChen0919/elastic_search_documentation/blob/elastic_search-to-github/images/build-search-block.png)

All search blocks will be displayed on the `/elastic_search` page

![elastic_search page](https://github.com/MingChen0919/elastic_search_documentation/blob/elastic_search-to-github/images/elastic_search.png)


### Monitor the number of items in the cron queue

Go to __/admin/config/system/queue-ui__ to check how many items remaining in your elastic\_search cron queue. When no items left in the elastic\_search cron queue, the site-wide indexing process is finished.

![queue ui](https://github.com/MingChen0919/elastic_search_documentation/blob/elastic_search-to-github/images/queue_items-number.png)

### Run your elastic_search cron queue with multiple threads
With the help of the __ultimate_cron__ module, you can run a cron queue with multiple threads. This will significantly speed up the indexing process.

Go to __/admin/config/system/cron/jobs/list/queue_elastic_queue/edit__ and select the number of threads you want to run
![ultimate cron](https://github.com/MingChen0919/elastic_search_documentation/blob/elastic_search-to-github/images/cron.png)

You may need to add the jobs to your crontab file to continously trigger your cron jobs if your website don't have frequent requests. Below is an example:

* login to your server
* `crontab -e` to open the crontab file
* Add the command lines below to your crontab file. You may add more lines, depending on how many threads you set up.
```
*/5 * * * * drush cron-run queue_elastic_queue --options=thread=21 --root=path/to/you/drupal/site/root
*/5 * * * * drush cron-run queue_elastic_queue_2 --options=thread=2 --root=path/to/you/drupal/site/root
*/5 * * * * drush cron-run queue_elastic_queue_3 --options=thread=3 --root=path/to/you/drupal/site/root
*/5 * * * * drush cron-run queue_elastic_queue_4 --options=thread=4 --root=path/to/you/drupal/site/root
*/5 * * * * drush cron-run queue_elastic_queue_5 --options=thread=5 --root=path/to/you/drupal/site/root
*/5 * * * * drush cron-run queue_elastic_queue_6 --options=thread=6 --root=path/to/you/drupal/site/root
*/5 * * * * drush cron-run queue_elastic_queue_7 --options=thread=7 --root=path/to/you/drupal/site/root
```




### Index joined fields from multiple tables
It is very common that we need to search/filter information from different tables and then display the results. `tripal_elasticsearch` allows you to do so very easily by indexing joined tables. First, you need to join the tables that contain the data that you want to index. Al long as the joined table is in your public database or chado database schema, it will become visible on the dropdown table list. Then you can index the table normally.

There are many ways to join tables. An easy way for chado tables is do create MViews. After you index the joined tables, you can delete them or the MViews. Below is an example of indexing data from 3 chado tables (chado.feature, chado.organism, and chado.blast\_hit\_data). The joined table name is called __search\_transcripts\_all__

![fields from multiple tables](https://github.com/MingChen0919/elastic_search_documentation/blob/elastic_search-to-github/images/fields-from-multiple-tables.png)

