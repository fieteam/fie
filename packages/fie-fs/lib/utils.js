'use strict';

module.exports = {
  templateSettings: {
    evaluate: /<{%([\s\S]+?)%}>/g,
    interpolate: /<{%=([\s\S]+?)%}>/g,
    escape: /<{%-([\s\S]+?)%}>/g
  }
};
