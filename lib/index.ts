/* - RUNTIME FAIL - */
export namespace Test {
    export const a = 1;
}

export namespace Test {
    export const b = a + 1;
}

/* - 1. WORKS - */

// export namespace Test {
//     export const a = 1;
// }

// export namespace Test {
//     export const b = Test.a + 1;
// }
   
/* - 2. WORKS - */
// export namespace Test {
//     export const a = 1;
//     export const b = a + 1;
// }
