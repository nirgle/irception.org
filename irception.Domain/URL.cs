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
    
    public partial class URL
    {
        public URL()
        {
            this.Votes = new HashSet<Vote>();
        }
    
        public int URLID { get; set; }
        public int FKChannelID { get; set; }
        public string URL1 { get; set; }
        public System.DateTime At { get; set; }
        public string Nick { get; set; }
        public string Type { get; set; }
        public string Thumbnail { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Nullable<bool> NSFW { get; set; }
        public int VoteCount { get; set; }
    
        public virtual Channel Channel { get; set; }
        public virtual ICollection<Vote> Votes { get; set; }
    }
}
