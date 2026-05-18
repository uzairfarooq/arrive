import "arrive";

document.arrive(".test-elem", (el) => console.log(el));
document.arrive(".test-elem", { timeout: 5000 }, (el) => console.log(el));
const el = await document.arrive(".test-elem");
document.leave(".test-elem", (el) => console.log(el));
Arrive.unbindAllArrive();
