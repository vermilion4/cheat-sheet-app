---
language: java
slug: princeton-intro
title: "Princeton Intro to Programming"
source: "https://introcs.cs.princeton.edu/java/11cheatsheet/"
order: 1
---

## Hello World

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World");
    }
}
```

Compile and run from the command line:

```
javac HelloWorld.java
java HelloWorld
```

## Built-in data types

| Type      | Description                    | Size    | Default   | Example literal |
|-----------|---------------------------------|---------|-----------|------------------|
| `int`     | integer                        | 32-bit  | `0`       | `42`             |
| `long`    | integer                        | 64-bit  | `0L`      | `42L`            |
| `double`  | floating-point real number     | 64-bit  | `0.0`     | `3.14`           |
| `boolean` | true / false                   | 1 bit   | `false`   | `true`           |
| `char`    | single character (UTF-16)      | 16-bit  | `'\u0000'`| `'a'`            |
| `String`  | sequence of characters (object, not primitive) | — | `null` | `"hello"` |

## Declaration & assignment

```java
int a;          // declare
a = 5;           // assign
int b = 10;      // declare + initialize in one statement
final double PI = 3.14159; // constant (cannot be reassigned)
```

Variable and constant naming conventions: variables/methods use `camelCase`; classes use `PascalCase`; constants use `ALL_CAPS`.

## Integers

Operators: `+  -  *  /  %` (`/` is integer division when both operands are `int`; `%` is remainder).

```java
int quotient  = 17 / 5;   // 3   (integer division truncates)
int remainder = 17 % 5;   // 2
```

`int` is 32-bit, range roughly &minus;2,147,483,648 to 2,147,483,647. `long` is 64-bit for a much larger range; suffix long literals with `L` (e.g. `42L`).

**Overflow:** arithmetic that exceeds the range silently wraps around (no exception, no warning) — e.g. `Integer.MAX_VALUE + 1` becomes `Integer.MIN_VALUE`. Use `long` when values might exceed ~2 billion.

## Floating-point numbers

`double` is the standard 64-bit IEEE 754 floating-point type (default for real-number literals like `3.14`). `float` is a 32-bit variant, rarely used.

```java
double x = 1.0 / 0.0;   // Infinity
double y = -1.0 / 0.0;  // -Infinity
double z = 0.0 / 0.0;   // NaN (Not a Number)
```

Special values: `Double.POSITIVE_INFINITY`, `Double.NEGATIVE_INFINITY`, `Double.NaN`. `NaN` is not equal to anything, including itself (`Double.isNaN(z)` to test).

Floating-point arithmetic is approximate — never compare `double`s with `==`; use a tolerance instead (`Math.abs(a - b) < 1e-9`).

## Booleans

```java
boolean isDone = false;
boolean p = true, q = false;

boolean and = p && q;   // logical AND (short-circuit)
boolean or  = p || q;   // logical OR  (short-circuit)
boolean not = !p;       // logical NOT
```

`&&` and `||` short-circuit: the right operand is not evaluated if the result is already determined by the left one.

## Comparison operators

| Operator | Meaning               |
|----------|-----------------------|
| `==`     | equal to (primitives) |
| `!=`     | not equal to          |
| `<`      | less than             |
| `<=`     | less than or equal    |
| `>`      | greater than          |
| `>=`     | greater than or equal |

`==` compares primitive values directly, but for objects (including `String`) it compares *references*, not contents. Use `.equals()` to compare object/`String` contents:

```java
String a = new String("hi");
String b = new String("hi");
a == b;          // false — different objects
a.equals(b);     // true  — same contents
```

## Type conversion

**Implicit (widening) casts** happen automatically when no precision is lost, e.g. `int` → `long` → `double`.

**Explicit (narrowing) casts** require syntax and may lose information:

```java
double d = 3.99;
int i = (int) d;      // 3 (truncates toward zero, does not round)
int j = (int) 65.0;   // 65
char c = (char) 65;   // 'A'
```

Parsing strings to numbers, and converting values back to strings:

```java
int n      = Integer.parseInt("42");
double x   = Double.parseDouble("3.14");
long L     = Long.parseLong("123456789012");
String s1  = Integer.toString(42);      // "42"
String s2  = String.valueOf(3.14);      // "3.14"
String s3  = "" + 42;                    // "42" (concatenation trick)
```

## If / if-else

```java
if (x > 0) {
    System.out.println("positive");
} else if (x < 0) {
    System.out.println("negative");
} else {
    System.out.println("zero");
}

// ternary operator
String sign = (x >= 0) ? "non-negative" : "negative";
```

## While / for / do-while loops

```java
// while
int i = 0;
while (i < n) {
    System.out.println(i);
    i++;
}

// for
for (int j = 0; j < n; j++) {
    System.out.println(j);
}

// do-while — body always runs at least once
int k = 0;
do {
    System.out.println(k);
    k++;
} while (k < n);
```

`break` exits the loop immediately; `continue` skips to the next iteration.

## Switch

```java
switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    default:
        System.out.println("Some other day");
        break;
}
```

Forgetting `break` falls through to the next case. Modern arrow form (Java 14+) avoids fall-through:

```java
switch (day) {
    case 1 -> System.out.println("Monday");
    case 2 -> System.out.println("Tuesday");
    default -> System.out.println("Some other day");
}
```

## Arrays

**1D declaration and initialization:**

```java
int[] a = new int[10];        // array of 10 ints, all initialized to 0
int[] b = { 1, 2, 3, 4, 5 };  // array literal
a[0] = 42;                     // assign to index 0
int len = a.length;            // length is a field, not a method
```

**2D arrays:**

```java
double[][] grid = new double[3][4];   // 3 rows, 4 columns
grid[1][2] = 9.0;
int rows = grid.length;        // number of rows
int cols = grid[0].length;     // number of columns

double[][] m = {
    { 1.0, 2.0 },
    { 3.0, 4.0 }
};
```

**Common patterns:**

```java
// find the max
int max = a[0];
for (int i = 1; i < a.length; i++) {
    if (a[i] > max) max = a[i];
}

// sum all elements
int sum = 0;
for (int x : a) {
    sum += x;
}

// reverse in place
for (int i = 0, j = a.length - 1; i < j; i++, j--) {
    int temp = a[i];
    a[i] = a[j];
    a[j] = temp;
}
```

## Math library

All in `java.lang.Math`, used as `Math.method(...)`:

| Method              | Description                          |
|---------------------|----------------------------------------|
| `Math.abs(a)`       | absolute value                       |
| `Math.max(a, b)`    | larger of two values                 |
| `Math.min(a, b)`    | smaller of two values                |
| `Math.pow(a, b)`    | `a` raised to the power `b`          |
| `Math.sqrt(a)`      | square root                          |
| `Math.exp(a)`       | exponential function (e<sup>a</sup>) |
| `Math.log(a)`       | natural logarithm (base e)           |
| `Math.sin(a)` / `Math.cos(a)` / `Math.tan(a)` | trigonometric functions (radians) |
| `Math.round(a)`     | rounds to nearest `long` (or `int` for a `float` argument) |
| `Math.floor(a)`     | rounds down to nearest integer (`double`) |
| `Math.ceil(a)`      | rounds up to nearest integer (`double`) |
| `Math.random()`     | pseudo-random `double` in `[0.0, 1.0)` |
| `Math.PI`           | the constant &pi;                    |
| `Math.E`            | the constant e                       |

## The String type

`String`s are immutable objects. Concatenate with `+`:

```java
String greeting = "Hello, " + "World" + "!";
String withNum  = "Value: " + 42;   // numbers auto-convert to String
```

Common methods:

| Method                    | Description                                  |
|---------------------------|-----------------------------------------------|
| `s.length()`              | number of characters                         |
| `s.charAt(i)`              | character at index `i` (0-based)             |
| `s.substring(a)`           | substring from index `a` to the end          |
| `s.substring(a, b)`        | substring from index `a` (incl.) to `b` (excl.) |
| `s.indexOf(t)`             | index of first occurrence of `t`, or -1      |
| `s.equals(t)`              | content equality                             |
| `s.equalsIgnoreCase(t)`    | content equality, ignoring case              |
| `s.compareTo(t)`           | lexicographic comparison (negative/0/positive) |
| `s.toUpperCase()` / `s.toLowerCase()` | case-converted copy               |
| `s.trim()`                 | copy with leading/trailing whitespace removed |
| `s.replace(old, new)`      | copy with all occurrences of `old` replaced   |
| `s.split(regex)`           | splits into a `String[]` on a regex delimiter |
| `s.toCharArray()`          | copy as a `char[]`                            |
| `String.format(fmt, ...)`  | printf-style formatted string                 |

## Standard input/output

Plain Java uses `System.out` for output:

```java
System.out.println("prints a line, with a trailing newline");
System.out.print("no trailing newline");
System.out.printf("%d + %d = %d%n", 2, 2, 4);
```

`StdIn`, `StdOut`, and `StdDraw` are **Princeton course libraries** (from `stdlib.jar`, part of the *Introduction to Programming in Java* textbook toolkit) — they are **not** part of standard Java. They provide simplified static-method APIs for reading typed input and drawing:

```java
int n       = StdIn.readInt();
double x    = StdIn.readDouble();
String line = StdIn.readLine();
boolean eof = StdIn.isEmpty();

StdOut.println("formatted like System.out, plus extras");
```

## Functions (static methods)

Anatomy: `static <return-type> <name>(<parameter list>) { ... }`

```java
public static double square(double x) {
    return x * x;
}
```

Called as `square(5.0)`. `static` means the method belongs to the class itself, not to an instance — call it without creating an object (e.g. `Math.sqrt(...)`).

**Overloading:** multiple methods can share a name if their parameter lists differ (different number or types of parameters); the compiler picks the matching one at compile time.

```java
static int max(int a, int b) { return (a > b) ? a : b; }
static double max(double a, double b) { return (a > b) ? a : b; }
static int max(int a, int b, int c) { return Math.max(a, Math.max(b, c)); }
```

## Objects & classes

A class bundles instance variables (state) with methods (behavior). Objects are created with `new`.

```java
public class Point {
    private double x;   // instance variable
    private double y;   // instance variable

    public Point(double x, double y) {   // constructor
        this.x = x;
        this.y = y;
    }

    public double distanceTo(Point that) {
        double dx = this.x - that.x;
        double dy = this.y - that.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public String toString() {
        return "(" + x + ", " + y + ")";
    }
}
```

Usage:

```java
Point p1 = new Point(0.0, 0.0);
Point p2 = new Point(3.0, 4.0);
double d = p1.distanceTo(p2);   // 5.0
System.out.println(p1);          // calls toString() implicitly -> (0.0, 0.0)
```

`this` refers to the current instance. Instance variables hold each object's own state; every object created from the class gets its own copy.
