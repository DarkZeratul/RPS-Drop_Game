export class GameObject
{
    constructor(x, y, width, height, vx, vy, rps, img)
    {
        // Set X and Y Coordinates.
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // Set X and Y Velocities.
        this.vx = vx;
        this.vy = vy;

        this.rps = rps; // Rock, Paper, or Scissor.
        this.img = img; // Image of the Game Object.
    }

    move()
    {
        this.x += this.vx;
        this.y += this.vy;
    }

    render(context)
    {        
        context.drawImage(
            this.img, 
            this.x, 
            this.y);
    }
}