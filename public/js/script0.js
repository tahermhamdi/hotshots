//class ClassName {
//     constructor() {
//
//     }
// }
//class is a kind of object
// hide the reality of prototype
//old way with prototype
// function Rectangle(w, h){
//     this.width = w;
//     this.height = h;
// }
// Rectangle.protoype.getArea = function(){
//     return this.width = this.height
// }
// function Square(n){
//     Rectangle.call(this, n, n)
// }
//
//code is automatic strict mode in classes
class Rectangle {
    constructor(w, h,n) {
        this.width = w;
        this.height = h;
        this.name = n;
    }
    getArea() {
        console.log(":knf:ksbf,n:g,nfg");
        return this.width * this.height;
    }
}
class Square extends Rectangle{
    constructor(n,name){
        //before you calling super this is undefined
        super(n,n);
        this.name = name;
        console.log(this.width, this.height);
    }
    shoutArea(){
        return getArea() + "1"
    }
    isSquare(){
        return true;
    }

}
var s = new Square(4,"hello world");
// we must use new (instance)
var r = new Rectangle(4,5);
var thing = class {
    constructor() {
        console.log('yo')
    }
}
console.log(typeof Rectangle);
console.log(r.width, r.height, r.getArea());
console.log(typeof thing);
console.log(Rectangle.prototype.GetArea + " ");
console.log(s.getArea());
console.log(s);
console.log(s.constructor);
