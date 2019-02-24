import { TOTAL_OF_FRAMES, FRAMES_PER_ANIMATION } from "./interface.js";


export class Player
{
    constructor(x, y, width, height, myFrames)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.rps = 0; // Rock, Paper, or Scissor.

        this.arrayOfFrames = myFrames;
        this.currentFrame = 0;
        
        this.isAnimated = false;
    }

    render(context)
    {
        this.update();

        context.drawImage(
            this.arrayOfFrames[this.currentFrame], 
            this.x, 
            this.y);
    }

    // Updates the Current RPS and Frame Image.
    update()
    {
        if (this.isAnimated)
        {            
            if (++this.currentFrame >= TOTAL_OF_FRAMES)
                this.currentFrame = 0;

            if (this.currentFrame % FRAMES_PER_ANIMATION == 0)
            {
                this.isAnimated = false;
            }

            this.rps = Math.floor(this.currentFrame / FRAMES_PER_ANIMATION);
        }
    }
}