# D3js Pie chart for ExtJs 4

## Example:
![Example pic](https://github.com/antonfisher/extjs-d3pie-chart/raw/master/docs/d3pie-example-1.png)

## How to use

1. Copy sass file (_/sass/src/ux/chart/series/D3Pie.scss_) to your project;
2. Copy js file (_/app/ux/chart/series/D3Pie.js_) to your project;
3. Change serie class name "_Sandbox.ux.chart.series.D3Pie_";
4. Add requires
  ```javascript
    requires: [
      ...
      'Sandbox.ux.chart.series.D3Pie'
    ]
  ```

5. Update chart config:

```javascript
{
  xtype: 'chart'
  ...
  cls: 'ux-d3-pie',                           // add css class for d3pie
  series: [
    {
      type: 'd3pie',                          // change serie type
      d3: d3,                                 // add link to d3 library
      angleField: 'value',
      radius: 90,
      donut: 60,
      label: {
        field: 'name',
        legendField: 'legend'
      },
      totalValueRenderer: function (value) {  // renderer for total value [optional]
        return (value + "K");
      }
    }
  ]
}
```

## Options

* `d3: undefined` {Object} link to D3 library object __[required]__
* `radius: undefined` {Number} pie radius ('_undefined_' for auto)
* `donut: undefined` {Number} donut radius ('_undefined_' for auto)
* `centerX: undefined` {Number} pie center _X_ coordinate ('_undefined_' for auto)
* `centerY: undefined` {Number} pie center _Y_ coordinate ('_undefined_' for auto)
* `labelTextOffset: 15` {Number} labels offset
* `angleField: 'value'` {String} store property name for pie value
* `label: {field: 'name'}` {Object} label properties
* `showItemDescription: true` {Boolean} show text description under value
* `totalTitle: 'TOTAL'` {String} total title
* `noDataText: 'NO DATA'` {String} no data text
* `highlightStyle: 'opacity: 0.1'` {String} highlight style for pie item's path
* `unHighlightStyle: 'opacity: 1'` {String} unhighlight style for pie item's path
* `filterAngle: 0.25` {Number} hide label when angle is less than this value
* `border: 0` {Number} pie border
* `pathStrokeWidth: 1` {Number} pie paths stroke width
* `pathStrokeColor: '#ffffff'` {String} pie paths stroke color
* `borderColor: '#eeeeee'` {String} pie border color (if _border_ property > 0)
* `backgroundColor: '#ffffff'` {String} pie background color
* `emptyBackgroundColor: '#eeeeee'` {String} empty pie background color

Renderers:
* `totalValueRenderer: function (totalValue, store) {...}` {Function} renderer for pie total value
* `itemValueRenderer: function (dataItem, totalValue, store) {...}` {Function} renderer for item value
* `itemDescriptionRenderer: function (dataItem, totalValue, store) {...}` {Function} renderer for pie item description

## Thanks for:
* [http://jsfiddle.net/stephenboak/hYuPb/](http://jsfiddle.net/stephenboak/hYuPb/)
* [http://d3js.org](http://d3js.org/)
