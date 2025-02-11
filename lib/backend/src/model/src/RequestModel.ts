import { Auth } from "../../telecom/auth";

interface RequestBody {
  auth: Auth;
  func_name: string;
  data: Record<string, unknown>;
}

export { RequestBody };
