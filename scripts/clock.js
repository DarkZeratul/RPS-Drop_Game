export class Clock
{
    constructor(x, y, r, seconds)
    {
        this.x = x;
        this.y = y;
        this.r = r;
        this.seconds = seconds;
    }

    // Returns the Seconds Left on the Clock.
    getSeconds()
    {
        return this.seconds;
    }

    // Updates the Seconds on the Clock.
    update(seconds)
    {
        this.seconds += seconds;
        if (this.seconds < 0)
            this.seconds = 0;
    }

    render(context)
    {
        context.save();

        let angle = ((this.seconds / 60) % 1) * (2 * Math.PI);
        let minutes = Math.floor(this.seconds / 60);

        context.fillStyle = "lightblue";

        // Draw the Clock's Border
        context.beginPath();
        context.arc(
            this.x,
            this.y,
            this.r,
            0,
            2 * Math.PI
        );
        context.stroke();
    
        // Draw the Animation of the Number of Seconds Left on the Clock.
        context.beginPath();
        context.arc(
            this.x,
            this.y,
            this.r,
            1.5 * Math.PI,
            1.5 * Math.PI + angle
        );
        context.lineTo(this.x, this.y);
        context.closePath();
        context.stroke();
        context.fill();

        // Draw the Number of Minutes Left on the Clock.
        context.textAlign = "center"; 
        context.textBaseline = "middle";
        context.font = "32px Times New Roman";
        context.fillStyle = "black";

        if (minutes > 0)
            context.fillText("+" + minutes + "'", this.x, this.y);
        else
            context.fillText(minutes + "'", this.x, this.y);    
        
        context.restore();
    }}