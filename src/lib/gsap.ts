import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { EASE_REVEAL, EASE_CURTAIN, EASE_HOVER } from "@/src/lib/easing";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, MorphSVGPlugin, DrawSVGPlugin);

CustomEase.create("easeReveal", EASE_REVEAL.join(","));
CustomEase.create("easeCurtain", EASE_CURTAIN.join(","));
CustomEase.create("easeHover", EASE_HOVER.join(","));

export { gsap, ScrollTrigger, SplitText, CustomEase, MorphSVGPlugin, DrawSVGPlugin };
