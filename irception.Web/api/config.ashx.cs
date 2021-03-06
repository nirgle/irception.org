﻿using System.Web;
using System.Linq;
using irception.Domain;
using irception.Domain.DTO;
using Newtonsoft.Json;

namespace irception.Web.api
{
    /// <summary>
    /// Return configuration information to the caller
    /// </summary>
    public class config : APIBase, IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            var repo = new Repository();
            var networks = repo.GetNetworks();

            var plain = networks
                .Select(PlainNetwork.FromModelNetwork)
                .ToList();

            var json = JsonConvert.SerializeObject(new {
                Networks = plain
            });

            SetNoCaching(context);
            context.Response.ContentType = "text/json";
            context.Response.Write(json);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}