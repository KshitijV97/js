export const useCopy = (text) => {
  const [copiedText, setCopiedText] = React.useState();

  const copy = async () => {
    if (!navigator?.clipboard) {
      console.warn("Not supported");
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
    } catch (error) {
      console.error("Failed to copy text");
      setCopiedText(null);
    }
  };

  return [copiedText, copy];
};
