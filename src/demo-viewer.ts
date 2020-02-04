//import { PuppyVM, PuppyCode, PuppyWorld } from './puppyvm/vm';
import { PuppyViewer } from './playground/viewer';

const viewer = new PuppyViewer(document.body);
viewer.setMarkdownDocument(`
# 正規分布です。 
$f(x) = \\frac{1}{\\sqrt {2\\pi \\sigma^2}} \\exp\\Biggl(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\Biggr) \\qquad (-\\infty<x<\\infty)$

`);
//editor.addLineHighLight(2, 2);

