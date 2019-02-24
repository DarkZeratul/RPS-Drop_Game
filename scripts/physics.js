// Checks Rectangle Collision Between 2 Objects.
export function isColliding(objA, objB)
{
    let xCenterA = objA.x + (objA.width / 2);   // X Center of ObjA
    let xCenterB = objB.x + (objB.width / 2);   // X Center of ObjB

    let yCenterA = objA.y + (objA.height / 2);  // Y Center of ObjA
    let yCenterB = objB.y + (objB.height / 2);  // Y Center of ObjB

    if ((Math.abs(xCenterA - xCenterB) > (objA.width + objB.width) / 2) ||
        (Math.abs(yCenterA - yCenterB) > (objA.height + objB.height) / 2))
        return false;
    else
        return true;
}

// Applies Gravity on ALL the Objects on a Array of Objects.
export function gravity(objs)
{
    objs.forEach(obj => {
        obj.vy += 0.1;
    });
}