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
    
    public partial class Ignore
    {
        public int IgnoreID { get; set; }
        public int FKChannelID { get; set; }
        public string Nick { get; set; }
        public System.DateTime DateAdded { get; set; }
        public int FKUserIDAddedBy { get; set; }
        public Nullable<System.DateTime> DateRemoved { get; set; }
    
        public virtual Channel Channel { get; set; }
        public virtual User User { get; set; }
    }
}
