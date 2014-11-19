// variables
var colorscale = d3.scale.linear()
    .domain([0, 1, 2])
    .range(['#606072', '#ff0000', '#00ffe6']);
var legendLabel = ['Antes','Durante','Después'];
var w = 250, h = 300;
var o3_cfg = { w: w,
               h: h,
               radius: 4,
               maxValue: 75,
               levels: 0,
               color: colorscale,
               ExtraWidthX: 150,
	       ExtraWidthY: 60 };
var pm10_cfg = { w: w,
                 h: h,
                 radius: 4,
                 maxValue: 90,
                 levels: 0,
                 color: colorscale,
                 ExtraWidthX: 150,
	         ExtraWidthY: 60 };
var data = { 'o3_24dic' : { 1 : [ ], 2 : [ ], 3 : [ ] },
             'pm10_24dic' : { 1 : [ ], 2 : [ ], 3 : [ ] },
             'o3_15sep' : { 1 : [ ], 2 : [ ], 3 : [ ] },
             'pm10_15sep' : { 1 : [ ], 2 : [ ], 3 : [ ] },
             'o3_28oct' : { 1 : [ ], 2 : [ ], 3 : [ ] },
             'pm10_28oct' : { 1 : [ ], 2 : [ ], 3 : [ ] },
             'o3_10may' : { 1 : [ ], 2 : [ ], 3 : [ ] },
             'pm10_10may' : { 1 : [ ], 2 : [ ], 3 : [ ] },
             'o3_31dic' : { 1 : [ ], 2 : [ ], 3 : [ ] },
             'pm10_31dic' : { 1 : [ ], 2 : [ ], 3 : [ ] },
             'o3_14feb' : { 1 : [ ], 2 : [ ], 3 : [ ] },
             'pm10_14feb' : { 1 : [ ], 2 : [ ], 3 : [ ] } };
var o3 = [ 'o3_24dic', 'o3_15sep', 'o3_28oct', 'o3_10may', 'o3_31dic', 'o3_14feb' ];
var pm10 = [ 'pm10_24dic', 'pm10_15sep', 'pm10_28oct', 'pm10_10may', 'pm10_31dic', 'pm10_14feb' ];

// procesamos y ordenamos csv
d3.csv('data.csv', function(err, csv) {
    csv.forEach(function(d) {
        for (i = 0; i < o3.length; i++) {
            data[o3[i]][d.control].push({ axis : d.year, value : d[o3[i]] });
        }
        for (i = 0; i < pm10.length; i++) {
            data[pm10[i]][d.control].push({ axis : d.year, value : d[pm10[i]] });
        }
    });
    for (i = 0; i < o3.length; i++) {
        var tmp1 = data[o3[i]]['1'].pop();
        var tmp2 = data[o3[i]]['3'].pop();
        var tmp3 = data[o3[i]]['2'].pop();
        data[o3[i]]['1'].unshift(tmp1);
        data[o3[i]]['3'].unshift(tmp2);
        data[o3[i]]['2'].unshift(tmp3);
    }
    for (i = 0; i < pm10.length; i++) {
        var tmp1 = data[pm10[i]]['1'].pop();
        var tmp2 = data[pm10[i]]['3'].pop();
        var tmp3 = data[pm10[i]]['2'].pop();
        data[pm10[i]]['1'].unshift(tmp1);
        data[pm10[i]]['3'].unshift(tmp2);
        data[pm10[i]]['2'].unshift(tmp3);
    }
    RadarChart.draw('#radar', [ data['o3_14feb']['1'],
                                data['o3_14feb']['3'],
                                data['o3_14feb']['2'] ], o3_cfg);
    drawLegend();
});

// startup
$(document).ready(function() {
    $('#menu a').bind('click', function(e) {
        e.preventDefault();
        $('#menu a').removeClass('active');
        $(this).addClass('active');
        var name = $('#contaminantes .active').attr('id') + '_' + $(this).attr('id');
        var cfg;
        if ($('#contaminantes .active').attr('id') == 'o3') { 
            cfg = o3_cfg;
            $('#unidades').text('Ozono en partes por billón');
        } else {
            cfg = pm10_cfg;
            $('#unidades').text('Partículas suspendidas menores a 10 micrómetros en microgramos por metro cúbico');
        }
        RadarChart.draw('#radar', [ data[name]['1'],
                                    data[name]['3'],
                                    data[name]['2'] ], cfg);
        drawLegend();
    });
    $('#contaminantes a').bind('click', function(e) {
        e.preventDefault();
        $('#contaminantes a').removeClass('active');
        $(this).addClass('active');
        var name = $(this).attr('id') + '_' + $('#menu .active').attr('id');
        var cfg;
        if ($(this).attr('id') == 'o3') { 
            cfg = o3_cfg;
            $('#unidades').text('Ozono en partes por billón');
        } else {
            cfg = pm10_cfg;
            $('#unidades').text('Partículas suspendidas menores a 10 micrómetros en microgramos por metro cúbico');
        }
        RadarChart.draw('#radar', [ data[name]['1'],
                                    data[name]['3'],
                                    data[name]['2'] ], cfg);
        drawLegend();
    });
});

// leyendas
function drawLegend() {
    var svg = d3.select('#body')
        .selectAll('svg')
        .append('svg');
    var legend = svg.append('g')
        .attr('class', 'legend')
        .attr('height', 100)
        .attr('width', 100)
        .attr('transform', 'translate(90,20)') ;
    legend.selectAll('rect')
        .data(legendLabel)
        .enter()
        .append('rect')
        .attr('x', -80)
        .attr('y', function(d, i){ return i * 20;})
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function(d, i){ return colorscale(i);});
    legend.selectAll('text')
        .data(legendLabel)
        .enter()
        .append('text')
        .attr('x', -65)
        .attr('y', function(d, i){ return i * 20 + 9;})
        .attr('font-size', '11px')
        .attr('fill', '#737373')
        .text(function(d) { return d; });
}
