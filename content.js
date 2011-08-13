var range = getSelection().getRangeAt(0);
if (range.startContainer == range.endContainer) {
  selectionLiesInOneNode(range.startContainer,
      range.startOffset, range.endOffset);
} else {
  selectionSpansManyNodes(range);
}

function selectionLiesInOneNode(node, startOffset, endOffset) {
  replaceTextIn(node, startOffset, endOffset);
}

function selectionSpansManyNodes(range) {
  replaceTextIn(range.startContainer,
      range.startOffset, range.startContainer.length);
  end = drillDown(range.endContainer)
  traverse(range.startContainer, end);
  replaceTextIn(end, 0, range.endOffset);
}

function drillDown(node) {
  while (node.firstChild)
    node = node.firstChild;
  return node;
}

function replaceTextIn(node, start, end) {
  if (typeof start === "undefined")
    start = 0;
  if (typeof end === "undefined")
    end = node.nodeValue.length;
  var replacement = replaceString(node.nodeValue.substring(start, end));
  var first = node.nodeValue.substring(0, start);
  var rest = node.nodeValue.substring(end, node.length);
  node.nodeValue = first + replacement + rest;
}

function replaceString(str) {
  return str.replace(/[a-z]/ig, function(s) {
    var c = s.charCodeAt(0);
    if ((c > 64 && c < 78) || (c > 96 && c < 110))
      return String.fromCharCode(c + 13);
    else
      return String.fromCharCode(c - 13);
  });
}

function traverse(startNode, endNode) {
  startNode = next(startNode);
  while (startNode !== endNode) {
    replaceTextIn(startNode);
    startNode = next(startNode);
  }
}

function next(textNode) {
  var node = nextLeaf(textNode);
  while (node.nodeType !== Node.TEXT_NODE)
    node = nextLeaf(node);
  return node;
}

function nextLeaf(node) {
  while (!node.nextSibling)
    node = node.parentNode;
  var sib = node.nextSibling;
  while (sib.firstChild)
    sib = sib.firstChild;
  return sib;
}
