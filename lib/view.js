// Copyright IBM Corp. 2017,2019. All Rights Reserved.
// Node module: loopback-connector-couchdb2
// This file is licensed under the Apache License 2.0.
// License text available at https://opensource.org/licenses/Apache-2.0

'use strict';

var URL = require('url');
var assert = require('assert');
var util = require('util');
var _ = require('lodash');

module.exports = mixinView;

function mixinView(CouchDB) {
  var debug = require('debug')('loopback:connector:couchdb2:view');

  /**
   * Gets data at `/{db}/_design/{ddocName}/views/{viewName}`
   *
   * Example:
   * User has a view called `getModel` in design document /{db}/_design/model,
   * to query the view, user can call function:
   * ```
   * ds.viewDocs(model, getModel, {key: 'purchase'}, cb);
   * ```
   *
   * @param {String} ddocName The design doc name without {db}/_design/ prefix
   * @param {String} viewName The view name
   * @param {Object} options The CouchDB view filter
   * @callback
   * @param {Function} cb
   */
  CouchDB.prototype.viewDocs = function(ddocName, viewName, options, cb) {
    // omit options, e.g. ds.viewDocs(ddocName, viewName, cb);
    if (typeof options === 'function' && !cb) {
      cb = options;
      options = {};
    }
    debug('CouchDB2.prototype.view ddocName %s viewName %s options %s',
      ddocName, viewName, options);

    var self = this;
    var db = this.couchdb.use(self.getDbName(self));

    db.view(ddocName, viewName, options, cb);
  };

  /**
   * Return CouchDB database name
   * @param {Object} connector The CouchDB connector instance
   * @return {String} The database name
   */
  CouchDB.prototype.getDbName = function(connector) {
    var dbName = connector.settings.database || connector.settings.db ||
    getDbFromUrl(connector.settings.url);
    return dbName;
  };
};

/**
 * Parse url and return the database name if provided
 * @param {String} url The CouchDB connection url
 * @return {String} The database name parsed from url
 */
function getDbFromUrl(url) {
  var parsedUrl = URL.parse(url);
  if (parsedUrl.path && parsedUrl.path !== '/')
    return parsedUrl.path.split('/')[1];
  return '';
}
