//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace irception.Domain
{
    using System;
    using System.Collections.Generic;
    
    public partial class Server
    {
        public int ServerID { get; set; }
        public int FKNetworkID { get; set; }
        public string Host { get; set; }
        public Nullable<int> Port { get; set; }
    
        public virtual Network Network { get; set; }
    }
}
