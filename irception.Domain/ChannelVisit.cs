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
    
    public partial class ChannelVisit
    {
        public int FKUserID { get; set; }
        public int FKChannelID { get; set; }
        public System.DateTime DateVisit { get; set; }
    
        public virtual Channel Channel { get; set; }
        public virtual User User { get; set; }
    }
}
