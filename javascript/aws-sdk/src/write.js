export default (text) => {
  const node = document.createElement('div');
  const textnode = document.createTextNode(text);
  node.appendChild(textnode);
  document.body.appendChild(node);
}