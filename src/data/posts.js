export const posts = [
  {
    slug: "jsscope",
    title: "JavaScript Scope",
    date: "2025-09-27",
    tags: ["javascript", "basics"],
    excerpt:
      "Scope is a very important concept in JavaScript. It defines where a variable can be accessed from in your code.",
    content: `JavaScript Scope
Scope is a very important concept in JavaScript. It defines where a variable can be accessed from in your code. There are three main types of scope in JavaScript:

Global Scope
Function Scope
Block Scope (introduced with let and const)
(Note: In ES6 modules, we also have Module Scope, which is limited to the module file.)

Variable Declarations and Scope
Variables declared with var have function scope.
Variables declared with let and const have block scope.
This means:

var is accessible throughout the function it is declared in (not globally, unless declared outside any function).
let and const are only accessible within the nearest enclosing block { ... }.
Avoid Using var
Because var does not have block scope, it can lead to unexpected behavior. Therefore, it is recommended to use let or const instead.

Scope Example:
let name = 'Ozgur';

function scope() {
	const surname = 'Ozbek';
	var age = 35;
	console.log(name + ' ' + surname + ' ' + age); 
}

scope(); // Output: Ozgur Ozbek 35

console.log(name);         // Output: Ozgur
console.log(surname);      // Error: surname is not defined
console.log(age);          // Error: age is not defined
✅ Summary
Use let and const — they respect block scope and help avoid unexpected behavior.
var is function-scoped, not block-scoped.
Variables declared inside a function are not accessible outside, even when using var.
Always understand how scope affects the accessibility and lifetime of your variables.
`,
  },
];
