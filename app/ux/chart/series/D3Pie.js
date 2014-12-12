/**
 * Pie chart d3js serie for ExtJs 4
 *
 * @author Anton Fischer <a.fschr@gmail.com>
 */
Ext.define('Sandbox.ux.chart.series.D3Pie', {
    extend: 'Ext.chart.series.Series',

    type: 'd3pie',

    alias: 'series.d3pie',

    /**
     * @cfg {Object} link to D3 library object
     */
    d3: undefined,

    /**
     * @cfg {Number} pie radius ('undefined' for auto)
     */
    radius: undefined,

    /**
     * @cfg {Number} donut radius ('undefined' for auto)
     */
    donut: undefined,

    /**
     * @cfg {Number} pie center X coordinate ('undefined' for auto)
     */
    centerX: undefined,

    /**
     * @cfg {Number} pie center Y coordinate ('undefined' for auto)
     */
    centerY: undefined,

    /**
     * @cfg {Number} labels offset
     */
    labelTextOffset: 15,

    /**
     * @cfg {String} store property name for pie value
     */
    angleField: 'value',

    /**
     * @cfg {Object} label properties
     */
    label: {
        field: 'name'
    },

    /**
     * @cfg {Boolean} show text description under value
     */
    showItemDescription: true,

    /**
     * @cfg {String} total title
     */
    totalTitle: 'TOTAL',

    /**
     * @cfg {String} no data text
     */
    noDataText: 'NO DATA',

    /**
     * @cfg {String} highlight style for pie item's path
     */
    highlightStyle: 'opacity: 0.1',

    /**
     * @cfg {String} unhighlight style for pie item's path
     */
    unHighlightStyle: 'opacity: 1',

    /**
     * @cfg {Number} hide label when angle is less than this value
     */
    filterAngle: 0.25,

    /**
     * @cfg {Number} pie border
     */
    border: 0,

    /**
     * @cfg {Number} pie paths stroke width
     */
    pathStrokeWidth: 1,

    /**
     * @cfg {String} pie paths stroke color
     */
    pathStrokeColor: '#ffffff',

    /**
     * @cfg {String} pie border color (if border property > 0)
     */
    borderColor: '#eeeeee',

    /**
     * @cfg {String} pie background color
     */
    backgroundColor: '#ffffff',

    /**
     * @cfg {String} empty pie background color
     */
    emptyBackgroundColor: '#eeeeee',

    constructor: function (config) {
        var self = this;

        if (!config.d3) {
            throw (self.$className + ': D3 library does not defined');
        }

        if (config.radius && config.radius <= 0) {
            throw (self.$className + ': Radius cannot be less than 0');
        }

        if (config.label) {
            config.label = Ext.applyIf(config.label, {
                field: 'name'
            });
        }

        self.d3 = config.d3;

        self.d3Data = {};

        self.d3ColorsGenrator = self.d3.scale.category20();

        self.callParent(arguments);

        self.chart.getChartStore().on('datachange', self.updateChart, self);
    },

    onRedraw: function () {
        var self = this;

        self.yField = [];
        self.chart.getChartStore().each(function (item) {
            var key = (self.label.legendField || self.label.field);
            self.yField.push(item.get(key));
        });
    },

    /**
     * Returns a string with the color to be used for the series legend item
     *
     * @param {Number} index
     * @returns {String} '#xxxxxx'
     */
    getLegendColor: function (index) {
        var self = this;

        return ((self.colorSet && self.colorSet[index]) || self.d3ColorsGenrator(index));
    },

    /**
     * Renderer for pie total value
     *
     * @param {Number}         totalValue calculated total value
     * @param {Ext.data.Store} store      chart store
     * @returns {String}
     */
    totalValueRenderer: function (totalValue, store) {
        return totalValue;
    },

    /**
     * Renderer for item value
     *
     * @param {Object}         dataItem   item value
     * @param {Number}         totalValue total value
     * @param {Ext.data.Store} store      chart store
     * @returns {String}
     */
    itemValueRenderer: function (dataItem, totalValue, store) {
        var percentage = (dataItem['value'] / totalValue) * 100;

        return percentage.toFixed(1) + '%';
    },

    /**
     * Renderer for pie item descriptions
     *
     * @param {Object}         dataItem   item value
     * @param {Number}         totalValue total value
     * @param {Ext.data.Store} store      chart store
     * @returns {String}
     */
    itemDescriptionRenderer: function (dataItem, totalValue, store) {
        var self = this;

        return (dataItem[self.label.field] || "-");
    },

    /**
     * Draw series for the current chart
     */
    drawSeries: function () {
        var self = this;
        var chart = self.chart;

        self.radius = Math.ceil(self.radius || (Math.min(chart.width, chart.height) / 3));
        self.donut = Math.ceil(
            (typeof self.donut !== 'undefined') ? Math.min(self.radius - 1, self.donut) : (self.radius - 10)
        );

        var chartEl = self.d3.select('#' + self.chart.getId() + ' svg')
            .attr('width', chart.width)
            .attr('height', chart.height);

        var minSide = Math.min(chart.width, chart.height);
        var centerX = (self.centerX || (minSide / 2));
        var centerY = (self.centerY || (minSide / 2));
        var centerTranslate = ('translate(' + centerX + ',' + centerY + ')');

        self.d3Data.arcGroup = self.d3Data.arcGroup || chartEl.append('svg:g').attr('transform', centerTranslate);
        self.d3Data.labelGroup = self.d3Data.labelGroup || chartEl.append('svg:g').attr('transform', centerTranslate);
        self.d3Data.centerGroup = self.d3Data.centerGroup || chartEl.append('svg:g').attr('transform', centerTranslate);

        self.updateChart();
    },

    /**
     * Update created pie chart
     */
    updateChart: function () {
        var self = this;
        var store = self.chart.getChartStore();
        var totalDataValue = 0;

        var fillFromStore = function (i) {
            var item = store.getAt(i);
            return {
                name: item.get(self.label.field),
                value: item.get(self.angleField)
            };
        };

        var storeData = self.d3.range(store.getCount()).map(fillFromStore);

        var donutFn = self.d3.layout.pie().value(function (d) {
            return d.value;
        }).sort(function () {
            // to sort as in store
            return true;
        });

        var getTextAnchorForLabel = function (d) {
            // label is left of center
            var isLeftOfCenter = ((d.startAngle + d.endAngle) / 2 < Math.PI);

            if (isLeftOfCenter) {
                return 'end';
            } else {
                return 'beginning';
            }
        };

        var arcFn = self.d3.svg.arc()
            .startAngle(function (d) {
                return -d.startAngle;
            })
            .endAngle(function (d) {
                return -d.endAngle;
            })
            .innerRadius(self.donut)
            .outerRadius(self.radius);

        var filteredStoreData = donutFn(storeData)
            .filter(function (item, index) {
                item.name = storeData[index].name;
                item.value = storeData[index].value;
                totalDataValue += item.value;
                return (item.value !== null);
            });

        self.d3RemoveCircles();
        self.d3RemoveLabels();

        self.d3DrawEmptyCircle(self.totalTitle, self.noDataText);

        if (filteredStoreData.length === 0) {
            return;
        }

        self.d3Data.totalValueLabel.text(function () {
            return self.totalValueRenderer(totalDataValue, store);
        });

        var filterAngleFn = function (item) {
            if (self.filterAngle) {
                return (Math.abs(item.endAngle - item.startAngle) > self.filterAngle)
            }

            return true;
        };

        self.d3Data.arcGroup.selectAll('path')
            .data(filteredStoreData)
            .enter().append('svg:path')
            .attr('stroke', self.pathStrokeColor)
            .attr('stroke-width', self.pathStrokeWidth)
            .attr('fill', function (d, i) {
                return self.getLegendColor(i);
            })
            .transition()
            .attrTween('d', function (d) {
                return function () {
                    return arcFn(d);
                }
            });

        self.d3Data.labelGroup.selectAll('line')
            .data(filteredStoreData)
            .enter()
            .append('svg:line')
            .filter(filterAngleFn)
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', -self.radius - 2)
            .attr('y2', -self.radius - 9)
            .attr('stroke', '#bbbbbb')
            .attr('transform', function (d) {
                return 'rotate(' + ((-d.startAngle - d.endAngle) / 2 * (180 / Math.PI)) + ')';
            });

        self.d3Data.labelGroup.selectAll('text.ux-d3-pie-value')
            .data(filteredStoreData)
            .enter()
            .append('svg:text')
            .filter(filterAngleFn)
            .attr('class', 'ux-d3-pie-value')
            .attr('transform', function (d) {
                return 'translate('
                    + Math.cos((-d.startAngle - d.endAngle - Math.PI) / 2) * (self.radius + self.labelTextOffset)
                    + ','
                    + Math.sin((-d.startAngle - d.endAngle - Math.PI) / 2) * (self.radius + self.labelTextOffset)
                    + ')';
            })
            .attr('dy', function (d) {
                if (
                    (d.startAngle + d.endAngle) / 2 > Math.PI / 2
                    && (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5
                ) {
                    return 5;
                } else {
                    if (self.showItemDescription) {
                        return -7;
                    }
                    return 0;
                }
            })
            .attr('text-anchor', getTextAnchorForLabel)
            .text(function (dataItem) {
                return self.itemValueRenderer(dataItem, totalDataValue, store);
            });

        if (self.showItemDescription) {
            self.d3Data.labelGroup.selectAll('text.ux-d3-pie-description')
                .data(filteredStoreData)
                .enter()
                .append('svg:text')
                .filter(filterAngleFn)
                .attr('class', 'ux-d3-pie-description')
                .attr('transform', function (d) {
                    return 'translate('
                        + Math.cos((-d.startAngle - d.endAngle - Math.PI) / 2) * (self.radius + self.labelTextOffset)
                        + ','
                        + Math.sin((-d.startAngle - d.endAngle - Math.PI) / 2) * (self.radius + self.labelTextOffset)
                        + ')';
                })
                .attr('dy', function (d) {
                    if (
                        (d.startAngle + d.endAngle) / 2 > Math.PI / 2
                        && (d.startAngle + d.endAngle) / 2 < Math.PI * 1.5
                    ) {
                        return 17;
                    } else {
                        return 5;
                    }
                })
                .attr('text-anchor', getTextAnchorForLabel)
                .text(function (itemData) {
                    return self.itemDescriptionRenderer(itemData, totalDataValue, store);
                });
        }
    },

    /**
     * Highlight Item on mouseover in legend
     */
    highlightItem: function () {
        var self = this;

        self.d3ApplyStyleToItems(self.highlightStyle, self._index);
    },

    /**
     * Unhighlight Item on mouseout in legend
     */
    unHighlightItem: function () {
        var self = this;

        self.d3ApplyStyleToItems(self.unHighlightStyle, self._index);
    },

    /**
     * Apply new style to pie items
     *
     * @param {String} style        new style
     * @param {Number} ignoredIndex index that will ignored
     */
    d3ApplyStyleToItems: function (style, ignoredIndex) {
        var self = this;
        var filterFn = function (item, index) {
            return (index !== ignoredIndex);
        };

        self.d3Data.arcGroup.selectAll('path')
            .filter(filterFn)
            .transition()
            .attr('style', style);

        // TODO fix filtered values
        //self.d3Data.labelGroup.selectAll('text.ux-d3-pie-value')
        //    .filter(filterFn)
        //    .transition()
        //    .attr('style', style);
        //
        //if (self.showItemDescription) {
        //    self.d3Data.labelGroup.selectAll('text.ux-d3-pie-description')
        //        .filter(filterFn)
        //        .transition()
        //        .attr('style', style);
        //}
    },

    /**
     * Remove pie circles
     */
    d3RemoveCircles: function () {
        var self = this;

        self.d3Data.arcGroup.selectAll('circle').remove();
    },

    /**
     * Remove pie labels
     */
    d3RemoveLabels: function () {
        var self = this;

        self.d3Data.arcGroup.selectAll('path').remove();
        self.d3Data.labelGroup.selectAll('line').remove();
        self.d3Data.labelGroup.selectAll('text.ux-d3-pie-value').remove();
        self.d3Data.labelGroup.selectAll('text.ux-d3-pie-description').remove();
    },

    /**
     * Draw empty pie with labels
     *
     * @param {String} topTitle    top title (first string)
     * @param {String} bottomTitle bottom title (second string)
     */
    d3DrawEmptyCircle: function (topTitle, bottomTitle) {
        var self = this;

        if (+self.border) {
            self.d3Data.arcGroup.append('svg:circle')
                .attr('fill', self.borderColor)
                .attr('r', self.radius + +self.border);
        }

        self.d3Data.arcGroup.append('svg:circle')
            .attr('fill', self.emptyBackgroundColor)
            .attr('r', self.radius);

        self.d3Data.centerGroup.append('svg:circle')
            .attr('fill', self.backgroundColor)
            .attr('r', self.donut + 1);

        self.d3Data.centerGroup.selectAll('.ux-d3-pie-center-texts').remove();

        self.d3Data.centerGroup.append('svg:text')
            .attr('class', 'ux-d3-pie-center-texts ux-d3-pie-top-title')
            .attr('dy', -5)
            .attr('text-anchor', 'middle')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 3)
            .attr('stroke-opacity', 0.8)
            .attr('stroke-linecap', 'round')
            .attr('stroke-linejoin', 'round')
            .attr('paint-order', 'stroke')
            .text(topTitle);

        self.d3Data.totalValueLabel = self.d3Data.centerGroup.append('svg:text')
            .attr('class', 'ux-d3-pie-center-texts ux-d3-pie-bottom-title')
            .attr('dy', (topTitle ? 13 : 6))
            .attr('text-anchor', 'middle')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 3)
            .attr('stroke-opacity', 0.8)
            .attr('stroke-linecap', 'round')
            .attr('stroke-linejoin', 'round')
            .attr('paint-order', 'stroke')
            .text(bottomTitle);
    }

});
