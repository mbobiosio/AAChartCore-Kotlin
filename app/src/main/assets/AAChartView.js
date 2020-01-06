
        var aaGlobalChart;

        function loadTheHighChartView (sender,receivedWidth, receivedHeight) {
        var aaOptions = JSON.parse(sender);
            if (aaOptions.xAxisArray) {
                aaOptions.xAxis = aaOptions.xAxisArray
                }

            if (aaOptions.yAxisArray) {
                aaOptions.yAxis = aaOptions.yAxisArray
                }


            aaOptions.credits = {enabled:false};

            if (aaOptions.plotOptions) {
                configurePlotOptions(aaOptions);
                }

            configureOptionsFormatters(aaOptions);

            aaGlobalChart = Highcharts.chart('container', aaOptions);
           //全局配置(可通过全局配置设置主题)https://api.hcharts.cn/highcharts#Highcharts.setOptions
        };

        function configurePlotOptions(aaOptions) {
                    var aaPlotOptions = aaOptions.plotOptions;
                    var animation = aaPlotOptions.series.animation;
                    if (animation) {//懒调用(只有在 AAChartModel 实例对象设置了 animationType 属性值的时候才会调用设置动画类型的函数,否则不调用)
                        var animationEasingType = animation.easing;
                        animation.easing = configureTheChartAnimationEasingType(animationEasingType);
                    }
                    // 添加鼠标事件
                    if (aaOptions.touchEventEnabled == true && aaPlotOptions.series) {
                        configureChartTouchEvent(aaPlotOptions);
                    }
                }

        function configureChartTouchEvent(aaPlotOptions) {
                    var mouseOverFunc = function(){
                        var message = {
                            name: this.series.name,
                            y :this.y,
                            x: this.x,
                            category:this.category,
                            offset:{plotX:this.plotX,plotY:this.plotY},
                            index: this.index,
                        };

                        var messageStr = JSON.stringify(message);
                        window.androidObject.androidMethod(messageStr);
                    };

                         var seriesPoint = {
                                    events:{
                                        mouseOver: mouseOverFunc,
                                    }
                                   };
                         aaPlotOptions.series.point = seriesPoint;
                }

        function configureOptionsFormatters(aaOptions) {
            if (aaOptions.tooltip
                && aaOptions.tooltip.formatter) {
                aaOptions.tooltip.formatter = eval(aaOptions.tooltip.formatter);
            }

            if (aaOptions.xAxis
                && aaOptions.xAxis.labels
                && aaOptions.xAxis.labels.formatter) {
                aaOptions.xAxis.labels.formatter = eval(aaOptions.xAxis.labels.formatter);
            }

            if (aaOptions.yAxis
                && aaOptions.yAxis.labels
                && aaOptions.yAxis.labels.formatter) {
                aaOptions.yAxis.labels.formatter = eval(aaOptions.yAxis.labels.formatter);
            }
        }

        function onlyRefreshTheChartDataWithSeries(receivedSeries) {
            var receivedSeriesArr = JSON.parse(receivedSeries);
            var seriesArrLength = receivedSeriesArr.length;
            for (var i = 0; i < seriesArrLength; i++) {
                var receivedSeriesElementData = receivedSeriesArr[i].data;
                // 获取series
                var seriesElement = aaGlobalChart.series[i];
                // 执行只刷新数据的函数
                seriesElement.setData(receivedSeriesElementData);
            }
        }

        function updateChart(optionsStr, redraw) {
            var options = JSON.parse(optionsStr);
            aaGlobalChart.update(options,redraw);
        }

        function addPointToChartSeries(elementIndex, optionsStr, redraw, shift, animation) {
            var options = JSON.parse(optionsStr);
            var redrawBool = (redraw == "true") ? true:false;
            var shiftBool = (shift == "true") ? true:false;
            var animationBool = (animation == "true") ? true:false;

            var seriesElement = aaGlobalChart.series[elementIndex];
            seriesElement.addPoint(options, redrawBool, shiftBool, animationBool);
        }

        //pragma mark -- setter method
        function setTheChartViewContentWidth(receivedWidth) {
            var container = document.getElementById('container'); //获得元素
            container.style.width = receivedWidth; //设置宽度
            aaGlobalChart.reflow();
        }

        function setTheChartViewContentHeight(receivedHeight) {
            var container = document.getElementById('container'); //获得元素
            container.style.height = receivedHeight; //设置高度
            aaGlobalChart.reflow();
        }

        function setChartSeriesHidden(hidden) {
            for (var i = 0; i < aaGlobalChart.series.length; i++) {
                var seriesElement = aaGlobalChart.series[i];
                if (hidden == true) {
                    seriesElement.hide();
                } else {
                    seriesElement.show();
                }
            }
        }

        function showTheSeriesElementContentWithIndex(elementIndex) {
            var seriesElement = aaGlobalChart.series[elementIndex];
            seriesElement.show();
        }

        function hideTheSeriesElementContentWithIndex(elementIndex) {
            var seriesElement = aaGlobalChart.series[elementIndex];
            seriesElement.hide();
        }

        function addElementToChartSeriesWithElement(elementStr) {
            var seriesElement = JSON.parse(elementStr);
            aaGlobalChart.addSeries(seriesElement);
        }

        function removeElementFromChartSeriesWithElementIndex(elementIndex) {
            var seriesElement = aaGlobalChart.series[elementIndex];
            if (seriesElement) {
                seriesElement.remove(true);
            }
        }

        function evaluateTheJavaScriptStringFunction(jsStringFunction) {
            eval(jsStringFunction);
        }