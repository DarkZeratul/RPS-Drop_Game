export class Score
{
    constructor(x, y, points)
    {
        this.x = x;
        this.y = y;
        this.points = points;
    }

    // Updates the Score's Points.
    update(points)
    {
        this.points += points;
    }

    render(context)
    {
        context.save();

        context.textAlign = "center"; 
        context.textBaseline = "middle";
        context.font = "32px Times New Roman";
        context.fillStyle = "black";
        context.fillText(this.points, this.x, this.y);

        context.restore();
    }
}