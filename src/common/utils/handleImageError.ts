export const handleImageError = (e: { target: { src: string; }; }) => {
  e.target.src = `https://beincrypto.com/wp-content/uploads/2019/08/ss_solana.png`;
};