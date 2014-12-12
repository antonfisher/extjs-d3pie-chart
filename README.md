# D3js Pie chart for ExtJs 4

![Example pic](https://github.com/antonfisher/extjs-d3pie-chart/raw/master/docs/d3pie-example-1.png)

## How to use

1. Copy sass file `/sass/src/ux/chart/series/D3Pie.scss` to your project;

2. Copy js file `/app/ux/chart/series/D3Pie.js` to your project;

3. Change class name `'Sandbox.ux.chart.series.D3Pie'`;

4. Add requires:
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
|Option|Description|
|---|---|
| `d3: undefined` | {_Object_} __[required]__ link to D3 library object |
| `radius: undefined` | {_Number_} pie radius ('_undefined_' for auto) |
| `donut: undefined` | {_Number_} donut radius ('_undefined_' for auto) |
| `centerX: undefined` | {_Number_} pie center _X_ coordinate ('_undefined_' for auto) |
| `centerY: undefined` | {_Number_} pie center _Y_ coordinate ('_undefined_' for auto) |
| `labelTextOffset: 15` | {_Number_} labels offset |
| `angleField: 'value'` | {_String_} store property name for pie value |
| `label: {field: 'name'}` | {_Object_} label properties |
| `showItemDescription: true` | {_Boolean_} show text description under value |
| `totalTitle: 'TOTAL'` | {_String_} total title |
| `noDataText: 'NO DATA'` | {_String_} no data text |
| `highlightStyle: 'opacity: 0.1'` | {_String_} highlight style for pie item's path |
| `unHighlightStyle: 'opacity: 1'` | {_String_} unhighlight style for pie item's path |
| `filterAngle: 0.25` | {_Number_} hide label when angle is less than this value |
| `border: 0` | {_Number_} pie border |
| `pathStrokeWidth: 1` | {_Number_} pie paths stroke width |
| `pathStrokeColor: '#ffffff'` | {_String_} pie paths stroke color |
| `borderColor: '#eeeeee'` | {_String_} pie border color (if _border_ property > 0) |
| `backgroundColor: '#ffffff'` | {_String_} pie background color |
| `emptyBackgroundColor: '#eeeeee'` | {_String_} empty pie background color |

__Renderers:__
* `totalValueRenderer: function (totalValue, store) {...}` {_Function_} renderer for pie total value
* `itemValueRenderer: function (dataItem, totalValue, store) {...}` {_Function_} renderer for item value
* `itemDescriptionRenderer: function (dataItem, totalValue, store) {...}` {_Function_} renderer for pie item description

## Libraries:
* [http://www.sencha.com/products/extjs/](http://www.sencha.com/products/extjs/)
* [http://d3js.org](http://d3js.org/)

## Thanks:
* [http://jsfiddle.net/stephenboak/hYuPb/](http://jsfiddle.net/stephenboak/hYuPb/)
