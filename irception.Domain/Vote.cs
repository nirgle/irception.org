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
    
    public partial class Vote
    {
        public int FKURLID { get; set; }
        public int FKUserID { get; set; }
        public int Value { get; set; }
        public System.DateTime DateVoted { get; set; }
    
        public virtual URL URL { get; set; }
        public virtual User User { get; set; }
    }
}
