class BBCClock
{
    constructor(p, screenWidth, screenHeight)
    {
        //----------------------------------------------------------------------------
        this.fillColour = p.color(100, 170, 250, 250);
        this.backgroundColour = p.color(24, 0, 170);
        //----------------------------------------------------------------------------
        this.x = 0;
        this.y = 0;
        this.width = screenWidth;
        this.height = screenHeight;
        //----------------------------------------------------------------------------
        this.clockDiameter = screenHeight / 2;
        this.clockRadius = this.clockDiameter / 2;
        this.startHourWidth = this.clockDiameter / 66;
        this.endHourWidth = this.clockDiameter / 16;
        this.hourHeight = this.endHourWidth * 3;
        this.hourWidthDifference = p.abs(this.endHourWidth - this.startHourWidth);
        this.hourWidthInc = this.hourWidthDifference / 12.;
        this.tickCenterOuterDiameter = 2 * this.clockDiameter / 7;
        this.tickCenterInnerDiameter = 3 * this.tickCenterOuterDiameter / 4;
        //----------------------------------------------------------------------------
        this.hourHandLength = this.clockRadius + this.hourHeight / 5;
        this.minuteHandLength = this.clockRadius + (this.hourHeight * 1.1);
        this.secondHandLength = this.clockRadius + (this.hourHeight * 1.1);
        this.minuteHandWidth = this.endHourWidth - this.hourWidthDifference / 2;
        this.secondHandWidth = this.secondHandLength / 70;
        this.hourHandWidth = this.minuteHandWidth;
        //----------------------------------------------------------------------------
    }

    drawClockFace(p)
    {
        p.background(this.backgroundColour);
        p.stroke(this.fillColour);
        p.fill(this.fillColour);
        for (var i = 0; i < 12; i++)
        {
            let hourWidth = this.startHourWidth + i * (this.hourWidthInc);
            let hourBarSpacing = hourWidth + this.endHourWidth / 3;
            const tickxpos = -hourWidth / 2 - hourBarSpacing / 2;
            let tickypos = -this.hourHeight / 2;
            let tickAngle = -(i * p.PI / 6) + 5 * p.PI / 6;
            p.push();
            let xpos = (this.clockRadius + this.hourHeight / 2) * p.sin(tickAngle);
            let ypos = (this.clockRadius + this.hourHeight / 2) * p.cos(tickAngle);
            p.translate(xpos, ypos);
            p.rotate(-tickAngle);
            p.rect(tickxpos, tickypos, hourWidth, this.hourHeight);
            p.rect(hourBarSpacing + tickxpos, tickypos, hourWidth, this.hourHeight);
            p.pop();
        }
    }

    display(p)
    {
        //----------------------------------------------------------------------------
        p.push();
        p.translate(this.width / 2, this.height / 2);
        //----------------------------------------------------------------------------
        this.drawClockFace(p);
        //----------------------------------------------------------------------------
        var s = p.second();
        var m = p.minute();
        var h = p.hour() % 12;

        p.fill(this.fillColour);
        p.stroke(this.fillColour);
        p.push();
        p.rotate(s * p.PI / 30);
        p.rect(-this.secondHandWidth / 2, 0, this.secondHandWidth, -this.secondHandLength);
        p.pop();

        p.push();
        p.rotate(m * p.PI / 30 + s * (p.PI / 1800));
        p.rect(-this.minuteHandWidth / 2, 0, this.minuteHandWidth, -this.minuteHandLength);
        p.pop();

        p.push();
        p.rotate(h * p.PI / 6 + m * (p.PI / 360));
        p.rect(-this.hourHandWidth / 2, 0, this.hourHandWidth, -this.hourHandLength);
        p.pop();

        p.ellipse(0, 0, this.tickCenterOuterDiameter, this.tickCenterOuterDiameter);
        p.fill(this.backgroundColour);
        p.ellipse(0, 0, this.tickCenterInnerDiameter, this.tickCenterInnerDiameter);
        //----------------------------------------------------------------------------
        p.pop();

    }
}