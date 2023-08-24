class Graph {
    constructor({svg, xPoints = 0, yPoints= 0, yLimit = 0}) {
        this.svg = svg;
        this.temperatureData = [];
        this.voltageData = [];

        this.xStart = 40;
        this.yStart = 40;
        this.xEnd = 1200;
        this.yEnd = 480;

        this.xPoints = xPoints;
        this.yPoints = yPoints;

        this.tickWidth = 5;
        this.xDistance = (this.xEnd - (this.xStart * 2)) / this.xPoints;
        this.yDistance = (this.yEnd - (this.yStart * 2)) / this.yPoints;

        this.xDifference = 1;
        this.yLimit = yLimit;
        this.yDifference = this.yLimit / this.yPoints;

        this.normalData = []
    }

    getLimitLineY(limit) {
        return this.yStart + ((this.yPoints - limit) * this.yDistance)
    }

    plotPoints(dataPoints) {
        let prev = {}
        dataPoints.forEach(((point, index) => {
            drawCircle(
                this.svg,
                {
                    cx: point.x,
                    cy: point.y,
                    r: 3,
                    fill: point.color,
                    id: point.id
                });
            if(index >= 1) {
                drawDataLine(this.svg,
                    {
                        x1: prev.x,
                        y1: prev.y,
                        x2: point.x,
                        y2: point.y,
                        stroke: point.color,
                        strokeWidth: 2,
                        id: point.id + "-line"
                    });
            }
            prev = point;
        }));
    }

    plotTemperature(temperatureData = []) {
        this.temperatureData = Object.entries(temperatureData).slice(-this.xPoints);

        this.plotPoints(this.temperatureData.map((cur, index) => {
            return {
                x: this.xStart + (this.xDistance * index) + this.xDistance,
                y: this.yStart + ((this.yLimit - cur[1]) / (this.yLimit / this.yPoints)) * this.yDistance,
                color: "blue",
                id: "temp-" + (index + 1)
            }
        }));

    }

    plotVoltage(voltageData = []) {
        this.voltageData = Object.entries(voltageData).slice(-this.xPoints);

        this.plotPoints(this.voltageData.map((cur, index) => {
            return {
                x: this.xStart + (this.xDistance * index) + this.xDistance,
                y: this.yStart + ((this.yLimit - cur[1]) / (this.yLimit / this.yPoints)) * this.yDistance,
                color: "red",
                id: "volt-" + (index + 1)
            }
        }));
    }

    plotOnX(data = []) {
        this.normalData = data;
        this.plotPoints(this.normalData.map((cur, index) => {
            return {
                x: this.xStart + (this.xDistance * index) + this.xDistance,
                y: this.yStart + ((this.yLimit - cur) / (this.yLimit / this.yPoints)) * this.yDistance,
                color: "blue",
                id: "data-" + (index + 1)
            }
        }));
    }

    plotPointOnX(point) {
        this.normalData.push(point);
        this.normalData.shift();

        this.plotPoints(this.normalData.map((cur, index) => {
            return {
                x: this.xStart + (this.xDistance * index) + this.xDistance,
                y: this.yStart + ((this.yLimit - cur) / (this.yLimit / this.yPoints)) * this.yDistance,
                color: "blue",
                id: "data-" + (index + 1)
            }
        }));
    }

    draw() {
        // draw x-axis
        drawLine(
            this.svg, {
                x1: this.xStart,
                y1: this.yEnd - this.yStart,
                x2: this.xEnd - this.xStart,
                y2: this.yEnd - this.yStart
            });

        // draw y-axis
        drawLine(
            this.svg,
            {
                x1: this.xStart,
                y1: this.yStart,
                x2: this.xStart,
                y2: this.yEnd - this.yStart
            });

        // draw x-axis ticks and text
        for(let i = 0; i <= this.xPoints; i++) {
            drawLine(
                this.svg,
                {
                    x1: this.xStart + (this.xDistance.toFixed(1) * i),
                    y1: this.yEnd - this.yStart,
                    x2: this.xStart + (this.xDistance.toFixed(1) * i),
                    y2: this.yEnd - this.yStart + this.tickWidth
                });

            drawText(
                this.svg,
                {
                    x: this.xStart + (this.xDistance.toFixed(1) * i) - 5,
                    y: this.yEnd - 20,
                    text: String(i * this.xDifference)
                });
        }

        // draw y-axis ticks and text
        for(let i= 0; i <= this.yPoints; i++) {
            drawLine(
                this.svg,
                {
                    x1: this.xStart - this.tickWidth,
                    y1: this.yStart + (this.yDistance.toFixed(1) * i),
                    x2: this.xStart,
                    y2: this.yStart + (this.yDistance.toFixed(1) * i)
                });

            drawText(
                this.svg,
                {
                    x: this.xStart - 30,
                    y: this.yStart + (this.yDistance.toFixed(1) * i) + 5,
                    text: String((this.yDifference * (this.yPoints - i)).toFixed(1))
                });
        }
    }
}