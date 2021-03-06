﻿using Newtonsoft.Json;

namespace irception.Domain
{
    public partial class API
    {
        public class AttrRequestParams
        {
            public int URLID { get; set; }
            public string SetAttr { get; set; }
            public string UnsetAttr { get; set; }
        }

        public static AttrRequestParams GetAttrRequestParams(string requestBody)
        {
            return JsonConvert.DeserializeObject<AttrRequestParams>(requestBody);
        }
    }
}
