/******************
 *	Point Object
 ******************/
var Point = function (context, x, y, randomSize, size) {
    var pSize = size ? size : 7;
    this.ctx = context;
    this.p = this.init = new FastVector(x, y);
    this.radius = randomSize ? this.randomMass() * pSize : pSize;
};

Point.prototype = {
    setPoint: function (p) {
        this.p = p;
    },

    getPoint: function () {
        return this.p;
    },

    move: function (away, amount, grow, shrink) {
        var mouse = away ? away : 0;
        var move_amount = amount ? amount : 0;
        var grow_speed = grow ? grow : 0.1;
        var shrink_speed = shrink ? shrink : 0.05;

        if (mouse.x > 0 || mouse.y > 0) {
            var tempVector = this.init.add(this.init.destination(this.init.direction(mouse), move_amount));
            this.p = this.p.add(tempVector.subtract(this.p).multiply(grow_speed));
        } else {
            this.p = this.p.add(this.init.subtract(this.p).multiply(shrink_speed));
        }
    },

    draw: function (offsetY) {
        offsetY = offsetY ? offsetY : 0;
        this.ctx.beginPath();
        this.ctx.arc(this.p.x, this.p.y + offsetY, this.radius, 0, Math.PI * 2, false);
        this.ctx.closePath;
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fill();
        this.ctx.stroke();
    },

    randomMass: function () {
        var nmin = 8;
        var nmax = 12;
        return (Math.floor(Math.random() * (nmax - nmin + 1)) + nmin) / 10;
    },
};

/******************
 *	Connection Object
 ******************/
var Connection = function (context, r1, i1, r2, i2) {
    this.ctx = context;

    this.r1 = r1;
    this.i1 = i1;
    this.r2 = r2;
    this.i2 = i2;

    this.p1 = points[this.r1][this.i1].p;
    this.p2 = points[this.r2][this.i2].p;
};

Connection.prototype = {
    update: function () {
        this.p1 = points[this.r1][this.i1].p;
        this.p2 = points[this.r2][this.i2].p;
    },

    draw: function (offsetY) {
        offsetY = offsetY ? offsetY : 0;
        this.ctx.beginPath();
        this.ctx.moveTo(this.p1.x, this.p1.y + offsetY);
        this.ctx.lineTo(this.p2.x, this.p2.y + offsetY);
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();
    },
};

/******************
 *	Triangle Object
 ******************/
var Triangle = function (context, r1, i1, r2, i2, r3, i3, color) {
    this.color = color ? color : "#5555CC";
    this.ctx = context;

    this.id = 0;
    this.name = "na";
    this.date = "";

    this.r1 = r1;
    this.i1 = i1;
    this.r2 = r2;
    this.i2 = i2;
    this.r3 = r3;
    this.i3 = i3;

    this.p1 = points[this.r1][this.i1].p;
    this.p2 = points[this.r2][this.i2].p;
    this.p3 = points[this.r3][this.i3].p;
};

Triangle.prototype = {
    update: function () {
        this.p1 = points[this.r1][this.i1].p;
        this.p2 = points[this.r2][this.i2].p;
        this.p3 = points[this.r3][this.i3].p;
    },

    draw: function (offsetY, color) {
        fillcolor = color ? color : this.color;
        offsetY = offsetY ? offsetY : 0;
        this.ctx.beginPath();
        this.ctx.moveTo(this.p1.x, this.p1.y + offsetY);
        this.ctx.lineTo(this.p2.x, this.p2.y + offsetY);
        this.ctx.lineTo(this.p3.x, this.p3.y + offsetY);
        this.ctx.lineTo(this.p1.x, this.p1.y + offsetY);

        this.ctx.save(); // Save the context before clipping
        this.ctx.clip(); // Clip to whatever path is on the context

        this.ctx.fillStyle = "#000";
        this.ctx.fill();

        this.ctx.restore(); // Get rid of the clipping region
    },

    redraw: function (offsetY) {
        offsetY = offsetY ? offsetY : 0;
        this.ctx.beginPath();
        this.ctx.moveTo(this.p1.x, this.p1.y + offsetY);
        this.ctx.lineTo(this.p2.x, this.p2.y + offsetY);
        this.ctx.lineTo(this.p3.x, this.p3.y + offsetY);
        this.ctx.lineTo(this.p1.x, this.p1.y + offsetY);
        this.ctx.stroke();

        points[this.r1][this.i1].draw(offsetY);
        points[this.r2][this.i2].draw(offsetY);
        points[this.r3][this.i3].draw(offsetY);
    },

    drawBlank: function (offsetY, color) {
        fillcolor = color ? color : this.color;
        offsetY = offsetY ? offsetY : 0;
        this.ctx.beginPath();
        this.ctx.moveTo(this.p1.x, this.p1.y + offsetY);
        this.ctx.lineTo(this.p2.x, this.p2.y + offsetY);
        this.ctx.lineTo(this.p3.x, this.p3.y + offsetY);
        this.ctx.lineTo(this.p1.x, this.p1.y + offsetY);
        this.ctx.fillStyle = fillcolor;
        this.ctx.fill();
    },

    height: function () {
        var smallest = this.p1.y;
        if (this.p2.y < smallest) {
            smallest = this.p2.y;
        }
        if (this.p3.y < smallest) {
            smallest = this.p3.y;
        }
        var largest = this.p1.y;
        if (this.p2.y > largest) {
            largest = this.p2.y;
        }
        if (this.p3.y > largest) {
            largest = this.p3.y;
        }
        return largest - smallest;
    },

    width: function () {
        var smallest = this.p1.x;
        if (this.p2.x < smallest) {
            smallest = this.p2.x;
        }
        if (this.p3.x < smallest) {
            smallest = this.p3.x;
        }
        var largest = this.p1.x;
        if (this.p2.x > largest) {
            largest = this.p2.x;
        }
        if (this.p3.x > largest) {
            largest = this.p3.x;
        }
        return largest - smallest;
    },

    centerX: function () {
        return this.originX() + this.width() / 2;
    },

    centerY: function () {
        return this.originY() + this.height() / 2;
    },

    originX: function () {
        var x = this.p1.x;
        if (this.p2.x < x) {
            x = this.p2.x;
        }
        if (this.p3.x < x) {
            x = this.p3.x;
        }
        return x;
    },

    originY: function () {
        var y = this.p1.y;
        if (this.p2.y < y) {
            y = this.p2.y;
        }
        if (this.p3.y < y) {
            y = this.p3.y;
        }
        return y;
    },

    area: function () {
        // Return area of this triangle
        return Math.abs(
            (this.p1.x * (this.p2.y - this.p3.y) +
                this.p2.x * (this.p3.y - this.p1.y) +
                this.p3.x * (this.p1.y - this.p2.y)) /
                2
        );
    },

    pointInTriangle: function (v) {
        var v0 = [this.p3.x - this.p1.x, this.p3.y - this.p1.y];
        var v1 = [this.p2.x - this.p1.x, this.p2.y - this.p1.y];
        var v2 = [v.x - this.p1.x, v.y - this.p1.y];

        var dot00 = v0[0] * v0[0] + v0[1] * v0[1];
        var dot01 = v0[0] * v1[0] + v0[1] * v1[1];
        var dot02 = v0[0] * v2[0] + v0[1] * v2[1];
        var dot11 = v1[0] * v1[0] + v1[1] * v1[1];
        var dot12 = v1[0] * v2[0] + v1[1] * v2[1];

        var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);

        var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        return u >= 0 && v >= 0 && u + v < 1;
    },

    movePoints: function (v, amount, grow, shrink) {
        points[this.r1][this.i1].move(v, amount, grow, shrink);
        points[this.r2][this.i2].move(v, amount, grow, shrink);
        points[this.r3][this.i3].move(v, amount, grow, shrink);
    },
};
