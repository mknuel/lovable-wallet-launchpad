
import { createThirdwebClient } from "thirdweb";
 
export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "your-thirdweb-client-id-here",
});
