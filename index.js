'use strict';

const _ = require('lodash');
const Class = require('class.extend');

module.exports = Class.extend({

  init: function(serverless, opts) {
    this._serverless = serverless;
    this._opts = opts;

    this.hooks = {
      'after:package:compileEvents': this.removeAuthHeaders.bind(this),
    };
  },

  removeAuthHeaders: function() {
    const template = this._serverless.service.provider.compiledCloudFormationTemplate;

    Object.keys(template.Resources).forEach(function(key){
      if (template.Resources[key]['Type'] == 'AWS::ApiGateway::Method') {
        let method = template.Resources[key];
        if(method.Properties] && method.Properties.Integration && method.Properties.Integration.RequestParameters){
          let requestParams = method.Properties.Integration.RequestParameters;
          if(requestParams['integration.request.header.Authorization']){
            delete requestParams['integration.request.header.Authorization'];
            this._serverless.cli.log('Removed Authorization header from integration request');
          }
        }
      }
    })

  },
});
